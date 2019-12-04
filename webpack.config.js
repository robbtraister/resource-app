'use strict'

const path = require('path')

const { DefinePlugin } = require('webpack')

const PROD_PATTERN = /^prod/i

const entry = {
  main: ['source-map-support/register', './src']
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
  extensions: ['.ts', '.mjs', '.js', '.cjs', '.yaml', '.yml', '.json']
}

const watchOptions = {
  ignored: /[\\/]node_modules[\\/]/
}

module.exports = (_, argv) => {
  const isProd =
    PROD_PATTERN.test(process.env.NODE_ENV) || PROD_PATTERN.test(argv.mode)

  const mode = isProd ? 'production' : 'development'

  return [
    {
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
      plugins: [
        new DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(mode),
          __PRODUCTION__: JSON.stringify(isProd),
          'typeof window': JSON.stringify(undefined)
        })
      ],
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
