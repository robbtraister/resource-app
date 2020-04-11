'use strict'

import express from 'express'

import { Server as ServerError } from '../../errors'

import projectsRouter from './projects'
import usersRouter from './users'

export default function router(options) {
  const apiRouter = express()

  apiRouter.use('/csrf', (req, res, next) => {
    res.send({ csrf: req.csrfToken && req.csrfToken() })
  })

  apiRouter.use('/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  apiRouter.use(['/error/:code(\\d+)', '/error'], (req, res, next) => {
    next(new ServerError(+req.params.code || 500))
  })

  apiRouter.use(
    '/v1/projects',
    (req, res, next) => {
      setTimeout(next, 500)
    },
    projectsRouter(options)
  )

  apiRouter.use('/v1/users', usersRouter(options))

  return apiRouter
}
