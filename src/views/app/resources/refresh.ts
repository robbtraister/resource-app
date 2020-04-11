'use strict'

import { Client } from 'react-router-resource'

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
