'use strict'

/* global expect, test */

import { Redirect, Unauthenticated, Unauthorized } from '../src/server/errors'

test('verify redirect error', () => {
  const redirect = new Redirect('/home')

  expect(redirect.statusCode).toBe(302)
  expect(redirect.location).toBe('/home')
})

test('verify permanent redirect error', () => {
  const redirect = new Redirect('/home', 301)

  expect(redirect.statusCode).toBe(301)
  expect(redirect.location).toBe('/home')
})

test('verify unauthenticated error', () => {
  const unauthenticated = new Unauthenticated()

  expect(unauthenticated.statusCode).toBe(401)
})

test('verify unauthorized error', () => {
  const unauthorized = new Unauthorized()

  expect(unauthorized.statusCode).toBe(403)
})
