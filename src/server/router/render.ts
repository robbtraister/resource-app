'use strict'

import path from 'path'

import renderSite from '../render'

const isRedirect = err => {
  const { statusCode } = err
  return statusCode >= 300 && statusCode < 400
}

export default function(options) {
  async function render(req, res, next) {
    try {
      res.send(
        await renderSite({
          appId: options.app.id,
          appTitle: options.app.title,
          location: req.originalUrl,
          projectRoot: options.projectRoot,
          user: req.user
        })
      )
    } catch (err) {
      next(err)
    }
  }

  return [
    render,

    async (err, req, res, next) => {
      // preserve redirect error from initial render attempt
      isRedirect(err)
        ? next(err)
        : render(req, res, renderErr => {
            // preserve redirect error from secondary render attempt
            next(isRedirect(renderErr) ? renderErr : err)
          })
    },

    (req, res, next) => {
      res.sendFile(
        path.join(options.projectRoot, 'build', 'dist', 'index.html'),
        err => {
          err && next()
        }
      )
    }
  ]
}
