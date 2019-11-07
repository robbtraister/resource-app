'use strict'

import express from 'express'

export default function router (options) {
  const authRouter = express()

  authRouter.use((req, res, next) => {
    req.user = {}
    next()
  })

  return authRouter
}
