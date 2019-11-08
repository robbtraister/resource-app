'use strict'

import express from 'express'

import api from './api'
import assets from './assets'
import auth from './auth'
import render from './render'

export default function router (options: Options) {
  const router = express()

  router.use(assets(options))

  // don't serve under '/auth' because we need to run authorization on all endpoints
  router.use(auth(options))

  router.use('/api', api(options))

  router.use(render(options))

  return router
}
