'use strict'

import { Router } from 'express'

export default function router (options) {
  const router = Router()

  router.use((req, res, next) => {
    res.send('hello, world!')
  })

  return router
}
