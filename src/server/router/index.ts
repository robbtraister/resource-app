'use strict'

import express from 'express'

export default function router (options) {
  const router = express()

  router.use('/api/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  router.use((req, res, next) => {
    res.send('hello, world!')
  })

  return router
}
