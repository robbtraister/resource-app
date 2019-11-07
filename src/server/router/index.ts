'use strict'

import express from 'express'

import api from './api'
import assets from './assets'
import auth from './auth'
import render from './render'

export default function router (options) {
  const router = express()

  router.use(assets(options))

  router.use(auth(options))
  router.use('/api', api(options))

  router.use(render(options))

  return router
}
