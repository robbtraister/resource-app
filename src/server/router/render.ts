'use strict'

import express from 'express'

export default function router (options) {
  const renderRouter = express()

  renderRouter.use((req, res, next) => {
    res.send('hello, world!')
  })

  return renderRouter
}
