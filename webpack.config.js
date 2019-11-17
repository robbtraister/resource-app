'use strict'

const path = require('path')

const env = require('./env')

const entry = {
  server: './src/server'
}

const output = {
  filename: '[name].js',
  chunkFilename: '[name].js',
  path: path.resolve(__dirname, 'build')
}

const resolve = {
  alias: {
    '~': __dirname
  },
  extensions: ['.ts', '.mjs', '.js', '.yaml', '.yml', '.json']
}

const watchOptions = {
  ignored: /[\\/]node_modules[\\/]/
}

const buildArtifact = path.resolve(output.path, Object.keys(entry)[0])

module.exports = (_, argv) => {
  const isProd = env.isProd || /^prod/i.test(argv.mode)

  return [
    {
      name: 'server',
      devServer: {
        before: app => {
          app.use((req, res, next) => {
            Object.keys(require.cache)
              .filter(pkg => !/[\\/]node_modules[\\/]/.test(pkg))
              .forEach(pkg => {
                delete require.cache[pkg]
              })

            require(buildArtifact).app(env)(req, res, next)
          })
        },
        host: '0.0.0.0',
        index: '',
        port: env.port,
        writeToDisk: true
      },
      entry,
      externals: [
        function(context, request, callback) {
          if (isProd) {
            return callback()
          }

          const packagePattern = /^([a-z][^/]*|@[a-z][^/]*\/[^/]+)(.*)/i
          const match = packagePattern.exec(request)
          if (!match) {
            return callback()
          }

          const pkg = match[1]
          callback(null, `commonjs ${resolve.alias[pkg] || pkg}${match[2]}`)
        }
      ],
      module: {
        rules: [
          {
            test: /\.ya?ml$/,
            use: ['json-loader', 'yaml-loader']
          },
          {
            test: /\.m?[jt]sx?$/,
            exclude: /[\\/]node_modules[\\/]/,
            use: ['babel-loader']
          }
        ]
      },
      output: {
        ...output,
        libraryTarget: 'commonjs2'
      },
      resolve,
      target: 'node',
      watchOptions,
      // the following are set to enable proper server-side source-map error logging
      devtool: 'source-map',
      mode: 'development',
      optimization: {
        minimize: false,
        namedChunks: true,
        namedModules: true,
        splitChunks: false
      }
    }
  ]
}
