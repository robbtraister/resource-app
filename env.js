'use strict'

const path = require('path')

require('dotenv').config({ path: path.resolve('./.env') })

const isProd = /^prod/i.test(process.env.NODE_ENV)

module.exports = {
  isProd,

  projectRoot: path.resolve('.')
}
