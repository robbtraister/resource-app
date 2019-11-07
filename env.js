'use strict'

const path = require('path')

const { config = {} } = require('./package.json')

require('dotenv').config({ path: path.join(__dirname, '.env') })

const isProd = /^prod/i.test(process.env.NODE_ENV)

module.exports = {
  isProd,

  port:
    Number(process.env.PORT) ||
    Number(config.port) ||
    8080,

  projectRoot: path.resolve('.'),

  workerCount:
    (isProd)
      ? Number(process.env.WORKER_COUNT) ||
        Number(config.workerCount) ||
        require('os').cpus().length
      : 1
}
