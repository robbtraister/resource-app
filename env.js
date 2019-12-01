'use strict'

const path = require('path')

const { config = {} } = require('./package.json')

require('dotenv').config({ path: path.resolve('./.env') })

const facebook = process.env.FACEBOOK_APP_ID
  ? {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    }
  : null

const google = process.env.GOOGLE_CLIENT_ID
  ? {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  : null

const isProd = /^prod/i.test(process.env.NODE_ENV)

const port = Number(process.env.PORT) || Number(config.port) || 8080

module.exports = {
  auth: /^(disabled?|false|off)$/i.test(process.env.AUTH)
    ? null
    : {
        cookie:
          process.env.COOKIE ||
          (config.auth && config.auth.cookie) ||
          'jwt-token',
        secret: process.env.SECRET,
        providers: {
          facebook,
          google
        }
      },

  host: process.env.HOST || config.host || `http://localhost:${port}`,

  isProd,

  port,

  projectRoot: path.resolve('.'),

  workerCount: isProd
    ? Number(process.env.WORKER_COUNT) ||
      Number(config.workerCount) ||
      require('os').cpus().length ||
      1
    : 1
}
