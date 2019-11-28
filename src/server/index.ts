'use strict'

import cluster from 'cluster'

import debug from 'debug'

import app from './app'

import * as env from '~/env'

const debugMaster = debug('master')

export { app }

export default function server(options: Options = {}) {
  const port = Number(options.port) || env.port

  return app(options).listen(port, err =>
    err ? console.error(err) : console.log(`Listening on port: ${port}`)
  )
}

async function createWorker() {
  return new Promise(resolve => {
    const worker = cluster.fork()
    // add an exit handler so cluster will replace worker in the event of an unintentional termination
    worker.on('exit', (code, signal) => {
      createWorker()
    })
    worker.on('listening', resolve)
  })
}

export async function createWorkers(n = env.workerCount) {
  return Promise.all([...new Array(n)].map(createWorker))
}

async function terminateWorker(
  worker,
  gracefulDelay = 5000,
  forcefulDelay = 10000
) {
  return new Promise(resolve => {
    worker.removeAllListeners('exit')

    worker.on('exit', () => {
      resolve()
    })

    worker.disconnect()
    setTimeout(() => {
      worker.kill()
    }, gracefulDelay)
    setTimeout(() => {
      worker.process.kill()
    }, forcefulDelay)
  })
}

export function exitHandler(worker, code, signal) {
  debugMaster(`[PID:${worker.process.pid}] Exited with code: ${code}`)
}

export async function messageHandler(proc, msg: { id?; type?; action? } = {}) {
  const { id, type, action } = msg

  if (
    msg === 'restart' ||
    type === 'restart' ||
    (type === 'action' && action === 'restart')
  ) {
    const oldWorkers = Object.values(cluster.workers)

    delete require.cache[__filename]
    await master()

    oldWorkers.forEach(worker => {
      terminateWorker(worker)
    })

    proc.send({ id, type: 'complete' })
  }
}

async function master(options: Options = {}) {
  const { createWorkers, exitHandler, messageHandler } = eval('require(__filename)') // eslint-disable-line

  cluster.removeAllListeners('exit')
  cluster.on('exit', exitHandler)

  cluster.removeAllListeners('message')
  cluster.on('message', messageHandler)

  const workerCount = Number(options.workerCount) || env.workerCount
  return createWorkers(workerCount)
}

function main(options: Options = {}) {
  if (cluster.isMaster) {
    master(options)
  } else {
    server(options)
  }
}

// use eval and __filename instead of module to preserve functionality in webpack artifact
const isScript = eval('require.main && (require.main.filename === __filename)') // eslint-disable-line
isScript && main()

// cache the default app config for faster reload
export const devApp = env.isProd ? null : app()
