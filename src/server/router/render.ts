'use strict'

import path from 'path'

import express from 'express'

import renderSite from '../render'

export default function (options) {
  async function render (req, res, next) {
    try {
      res.send(
        await renderSite({
          appId: options.app.id,
          appTitle: options.app.title,
          location: req.originalUrl,
          projectRoot: options.projectRoot,
          user: req.user
        })
      )
    } catch (err) {
      next(err)
    }
  }

  const router = express()

  router.use(render)

  router.use(async (err, req, res, next) => {
    // ignore redirect errors
    if (err && err.statusCode && err.statusCode >= 400) {
      res.status(err.statusCode)
      // just propagate the original error
      await render(req, res, () => next(err))
    } else {
      next(err)
    }
  })

  router.use((req, res, next) => {
    res.sendFile(
      path.join(options.projectRoot, 'dist', 'index.html'),
      err => {
        err && next()
      }
    )
  })

  return router
}
