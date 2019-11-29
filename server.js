'use strict'

const cluster = require('cluster')

const { master, server } = require('./build/server')

if (cluster.isMaster) {
  master()
} else {
  server()
}
