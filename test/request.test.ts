'use strict'

/* global test */

import assert from 'assert'

import request from 'supertest'

import app from '../src/server/app'

test('200', () => {
  return request(app({ auth: null }))
    .get('/api/uri')
    .expect(200)
    .expect('Content-Type', /^application\/json(;|$)/)
    .then(res => {
      assert.strictEqual(res.body.uri, '/api/uri')
    })
})
