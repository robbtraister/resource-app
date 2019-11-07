'use strict'

import express from 'express'

import render from './render'

export default function router (options) {
  const router = express()

  router.use('/api/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  router.use(render(options))

  return router
}
