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
    const { page, cursor, ...nonPageQuery } = query
    const pageNum = +page || 1

    if (pageNum === 1) {
      return Promise.resolve(nonPageQuery)
    }

    const queryCursorString = this.serializeQuery(nonPageQuery)

    const queryCursorCache = (this.cursorCache[queryCursorString] =
      this.cursorCache[queryCursorString] || [])

    if (cursor || queryCursorCache.length > pageNum) {
      return Promise.resolve({
        ...nonPageQuery,
        cursor: cursor || queryCursorCache[pageNum]
      })
    } else {
      // recurse backwards until we find a page whose cursor is known
      return new Promise((resolve, reject) => {
        this.find(
          { ...nonPageQuery, page: pageNum - 1 },
          (err, _, attributes) => {
            if (err) {
              return reject(err)
            }

            const nextCursor = attributes.nextCursor || attributes.next
            queryCursorCache[pageNum] = nextCursor
            resolve({
              ...nonPageQuery,
              cursor: nextCursor
            })
          }
        )
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

    const { page, ...nonPageQuery } = query
    const pageNum = +page || 1

    const nonPageQueryString = this.serializeQuery(nonPageQuery)

    const queryCursorCache = (this.cursorCache[nonPageQueryString] =
      this.cursorCache[nonPageQueryString] || [])

    let queryCursorString
    if (queryCursorCache.length > pageNum) {
      queryCursorString = `${nonPageQueryString}&cursor=${queryCursorCache[pageNum]}`
      const ids = this.resourceCache.queries[queryCursorString]
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

    const promise = this.pageToCursor({ ...nonPageQuery, page: pageNum })
      .then(query => {
        queryCursorString = `${this.serializeQuery(query)}&cursor=${
          query.cursor
        }`
        return this.fetch(`${this.endpoint}?${queryCursorString}`)
      })
      .then(resp => resp.json())
      .then(payload => {
        const models = (
          (this.name ? payload[this.name.plural] : payload) || []
        ).map(datum => this.getModel(datum))

        if (this.name) {
          delete payload[this.name.plural]
        }

        const nextCursor = payload.nextCursor || payload.next
        queryCursorCache[pageNum] = nextCursor

        this.resourceCache.queries[queryCursorString] = models.map(model => {
          const id = model[this.idField]
          this.resourceCache.items[id] = model
          return id
        })

        return [models, this.name ? payload : {}]
      })

    return CursorClient.promiseToCallback(promise, callback)
  }
}
