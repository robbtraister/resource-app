'use strict'

const cluster = require('cluster')

if (cluster.isMaster) {
  require('./build/master').master()
} else {
  require('./build/server').server()
}
