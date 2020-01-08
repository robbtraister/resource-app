'use strict'

import express from 'express'

export default function router(options) {
  const apiRouter = express()

  apiRouter.use('/csrf', (req, res, next) => {
    res.send({ csrf: req.csrfToken() })
  })

  apiRouter.use('/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  return apiRouter
}
