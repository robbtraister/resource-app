'use strict'

import express from 'express'

import { Server as ServerError } from '../errors'

export default function router(options) {
  const apiRouter = express()

  apiRouter.use('/csrf', (req, res, next) => {
    res.send({ csrf: req.csrfToken() })
  })

  apiRouter.use('/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  apiRouter.use(['/error/:code(\\d+)', '/error'], (req, res, next) => {
    next(new ServerError(+req.params.code || 500))
  })

  return apiRouter
}
