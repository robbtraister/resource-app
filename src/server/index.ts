'use strict'

import cluster from 'cluster'

import app from './app'

import * as env from '~/env'

export { app }

export default function server(options: Options = {}) {
  const port = Number(options.port) || env.port

  return app(options).listen(port, err =>
    err ? console.error(err) : console.log(`Listening on port: ${port}`)
  )
}

function main(options: Options = {}) {
  if (cluster.isMaster) {
    const workerCount = Number(options.workerCount) || env.workerCount

    for (let w = 0; w < workerCount; w++) {
      cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
      // console.log(`worker ${worker.process.pid} died`)
      cluster.fork()
    })
  } else {
    server(options)
  }
}

// use eval and __filename instead of module to preserve functionality in webpack artifact
const isScript = eval('require.main && (require.main.filename === __filename)') // eslint-disable-line
isScript && main()

// cache the default app config for faster reload
export const devApp = env.isProd ? null : app()
