'use strict'

import { Callback, Client, FetchOptions, Query } from 'react-router-resource'

export class SignoutError extends Error {}

export class RefreshClient<Model> extends Client<Model> {
  async fetch(
    input: RequestInfo,
    init?: RequestInit | undefined
  ): Promise<Response> {
    try {
      return await super.fetch(input, init)
    } catch (error) {
      // if there was failure, see if it was a bad access token
      if (error.response && error.response.status === 401) {
        try {
          // try to refresh the token
          await super.fetch('/api/v1/tokens/refresh', {
            method: 'POST'
          })
        } catch (err) {
          // If refreshing fails, it means something has gone wrong with
          // the users refreshToken; to avoid partial states, log them out.
          if (err.response.status >= 400) {
            // couldn't refresh
            throw new SignoutError()
          } else {
            throw err
          }
        }

        return super.fetch(input, init)
      } else {
        throw error
      }
    }
  }
}

export class CursorClient<Model> extends RefreshClient<Model> {
  protected cursorCache = {}

  private pageToCursor(query: Query): Promise<Query> {
    const { page: pageArg, cursor, ...nonPageQuery } = query
    const page = +pageArg || 1

    if (page === 1) {
      return Promise.resolve(nonPageQuery)
    }

    const queryCursorString = this.serializeQuery(nonPageQuery)

    const queryCursorCache = (this.cursorCache[queryCursorString] =
      this.cursorCache[queryCursorString] || [])

    if (cursor || queryCursorCache.length > page) {
      return Promise.resolve({
        ...nonPageQuery,
        cursor: cursor || queryCursorCache[page]
      })
    } else {
      // recurse backwards until we find a page whose cursor is known
      return new Promise((resolve, reject) => {
        this.find({ ...nonPageQuery, page: page - 1 }, (err, _, attributes) => {
          if (err) {
            return reject(err)
          }

          const nextCursor = attributes.nextCursor || attributes.next
          queryCursorCache[page] = nextCursor
          resolve({
            ...nonPageQuery,
            cursor: nextCursor
          })
        })
      })
    }
  }

  find(query: Query): Promise<Model[]>
  find(query: Query, callback: undefined): void
  find(query: Query, callback: Callback<Model[]>): void
  find(query: Query, options: FetchOptions | undefined): Promise<Model[]>

  find(
    query: Query,
    options: FetchOptions | undefined,
    callback: undefined
  ): void

  find(
    query: Query,
    options: FetchOptions | undefined,
    callback: Callback<Model[]>
  ): void

  find(
    query: Query,
    optionsArg?: FetchOptions | Callback<Model[]>,
    callbackArg?: Callback<Model[]>
  ): Promise<Model[]> | void {
    const { options, callback } = CursorClient.parseFetchArgs(
      optionsArg,
      callbackArg
    )

    const page = +query.page || 1

    const queryString = this.serializeQuery(query)

    const queryCursorCache = (this.cursorCache[queryString] =
      this.cursorCache[queryString] || [])

    const cachedQueryString =
      queryCursorCache.length > page &&
      `${queryString}&cursor=${queryCursorCache[page]}`

    if (cachedQueryString) {
      const ids = this.resourceCache.queries[cachedQueryString]
      const models = ids && ids.map(id => this.resourceCache.items[id])

      if (callback) {
        callback(null, models)
        if (!options.refresh) {
          return
        }
      } else if (ids && !options.refresh) {
        return Promise.resolve(models)
      }
    }

    const promise = Promise.resolve(
      cachedQueryString ||
        this.pageToCursor({ ...query, page }).then(
          query => `${this.serializeQuery(query)}&cursor=${query.cursor}`
        )
    ).then(cursorQueryString =>
      this.fetch(`${this.endpoint}?${cursorQueryString}`)
        .then(resp => resp.json())
        .then(payload => {
          const models = (
            (this.name ? payload[this.name.plural] : payload) || []
          ).map(datum => this.getModel(datum))

          if (this.name) {
            delete payload[this.name.plural]
          }

          const nextCursor = payload.nextCursor || payload.next
          queryCursorCache[page] = nextCursor

          this.resourceCache.queries[cursorQueryString] = models.map(model => {
            const id = model[this.idField]
            this.resourceCache.items[id] = model
            return id
          })

          return [models, this.name ? payload : {}]
        })
    )

    return CursorClient.promiseToCallback(promise, callback)
  }
}
