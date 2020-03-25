'use strict'

import express from 'express'

import users from './users.json'

export default function usersRouter(options) {
  const usersRouter = express()

  usersRouter.get('/', (req, res, next) => {
    res.send({ users })
  })
  usersRouter.get('/me', (req, res, next) => {
    const user = users.find(user => user.me)

    req.query.jsonp && /^[$_a-z][$_a-z0-9]*$/i.test(req.query.jsonp)
      ? res.send(`/**/;${req.query.jsonp}(${JSON.stringify(user)})`)
      : res.send({ user })
  })
  usersRouter.get('/:userId', (req, res, next) => {
    res.send({ user: users.find(user => user.id === req.params.userId) })
  })

  return usersRouter
}
