'use strict'

const cluster = require('cluster')

const { master, server } = require('./build/server')

if (module === require.main) {
  ;(cluster.isMaster ? master : server)()
}
