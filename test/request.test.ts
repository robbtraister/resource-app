'use strict'

import assert from 'assert'

import request from 'supertest'

import app from '../src/server/app'

test('200', () => {
  return request(app({}))
    .get('/')
    .expect(200)
    .then(res => {
      assert.strictEqual(res.text, 'hello, world!')
    })
})
