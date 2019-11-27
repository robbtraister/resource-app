'use strict'

/* global expect, test */

import path from 'path'

import * as env from '../env'

test('verify env logic', () => {
  expect(env.isProd).toBe(false)
  expect(env.projectRoot).toBe(path.resolve(__dirname, '..'))
})
