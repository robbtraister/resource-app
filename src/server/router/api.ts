'use strict'

import express from 'express'

export default function router (options) {
  const apiRouter = express()

  apiRouter.use((req, res, next) => {
    req.user ? next() : res.sendStatus(401)
  })

  apiRouter.use('/uri', (req, res, next) => {
    res.send({ uri: req.originalUrl })
  })

  apiRouter.use((req, res, next) => {
    res.sendStatus(404)
  })

  return apiRouter
}
