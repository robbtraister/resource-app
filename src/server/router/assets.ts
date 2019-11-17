'use strict'

import path from 'path'

import express from 'express'

export default function router(options: Options) {
  const publicRoot = path.resolve(options.projectRoot || '.', 'public')

  const assetRouter = express()

  assetRouter.all(
    '/favicon.ico',
    express.static(publicRoot),
    (req, res, next) => {
      res.sendStatus(404)
    }
  )
  assetRouter.use(express.static(publicRoot))

  return assetRouter
}
