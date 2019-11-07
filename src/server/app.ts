'use strict'

import path from 'path'

import express from 'express'

import router from './router'

export default function app (options: { isProd?: boolean, projectRoot?: string } = {}) {
  const app = express()

  app.disable('x-powered-by')

  options.projectRoot &&
    app.use(express.static(path.join(options.projectRoot, 'public')))

  app.use(router(options))

  app.use(
    (err, req, res, next) => {
      if (
        err &&
        err.location &&
        err.statusCode &&
        err.statusCode >= 300 &&
        err.statusCode < 400
      ) {
        res.redirect(err.location)
      } else {
        next(err)
      }
    },
    (err, req, res, next) => {
      console.error(err)
      next(err)
    },
    options.isProd
      ? (err, req, res, next) => {
        res.sendStatus(err.statusCode || 500)
      }
      : (err, req, res, next) => {
        res.status(err.statusCode || 500).send(err.message || err.body || err)
      }
  )

  return app
}
