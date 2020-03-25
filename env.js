'use strict'

const path = require('path')

const { config = {} } = require('./package.json')

const DISABLED_PATTERN = /^(disabled?|false|no|off)$/i
// const ENABLED_PATTERN = /^(enabled?|true|on|yes)$/i

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
  app: {
    fileLimit:
      Number(process.env.FILE_LIMIT) || Number(config.fileLimit) || 16 * 1024,

    id: process.env.APP_ID || (config.app && config.app.id) || 'app',

    title: process.env.APP_TITLE || (config.app && config.app.title) || ''
  },

  auth: DISABLED_PATTERN.test(process.env.AUTH)
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

  isPreact: !(
    DISABLED_PATTERN.test(process.env.PREACT) ||
    [false, null].includes(config.preact)
  ),

  isProd,

  logging: !DISABLED_PATTERN.test(process.env.LOGGING),

  port,

  projectRoot: path.resolve('.'),

  ssr: !DISABLED_PATTERN.test(process.env.SSR),

  workerCount: isProd
    ? Number(process.env.WORKER_COUNT) ||
      Number(config.workerCount) ||
      require('os').cpus().length ||
      1
    : 1
}
