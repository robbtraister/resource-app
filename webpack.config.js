'use strict'

const childProcess = require('child_process')
// const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const env = require('./env')

const exec = promisify(childProcess.exec.bind(childProcess))

class OnBuildPlugin {
  constructor (fn) {
    this.fn = fn
  }

  apply (compiler) {
    compiler.hooks.done.tap('OnBuildPlugin', this.fn)
  }
}

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
  extensions: [
    '.tsx',
    '.ts',
    '.mjsx',
    '.mjs',
    '.jsx',
    '.js',
    '.yaml',
    '.yml',
    '.json',
    '.scss',
    '.sass',
    '.css'
  ]
}

const rules = ({ isProd, extractCss }) => [
  {
    test: /\.(eot|gif|jpe?g|otf|png|ttf|woff2?)$/,
    use: {
      loader: 'url-loader',
      options: {
        fallback: 'file-loader',
        limit: env.fileLimit,
        name: (isProd)
          ? 'dist/assets/[hash].[ext]'
          : 'dist/assets/[path][name].[ext]',
        publicPath: '/'
      }
    }
  },
  {
    test: /\.s?[ac]ss$/,
    use: (extractCss ? [{ loader: MiniCssExtractPlugin.loader }] : [])
      .concat({
        loader: 'css-loader',
        options: {
          modules: {
            mode: 'local'
          },
          onlyLocals: !extractCss,
          sourceMap: true
        }
      })
  },
  {
    test: /\.s[ac]ss$/,
    use: {
      loader: 'sass-loader',
      options: {
        implementation: require('sass')
      }
    }
  },
  {
    test: /\.ya?ml$/,
    use: ['json-loader', 'yaml-loader']
  },
  {
    test: /\.m?[jt]sx?$/,
    exclude: /[\\/]node_modules[\\/]/,
    use: [
      'babel-loader'
    ]
  },
  {
    test: /\.svg$/,
    use: [
      'babel-loader',
      'react-svg-loader',
      'svgo-loader'
    ]
  }
]

const watchOptions = {
  ignored: /[\\/]node_modules[\\/]/
}

const buildArtifact = path.resolve(output.path, Object.keys(entry)[0])

module.exports = (_, argv) => {
  const isProd = (env.isProd || /^prod/i.test(argv.mode))

  const mode = (isProd)
    ? 'production'
    : 'development'

  return [
    {
      name: 'server',
      devServer: {
        before: (app) => {
          app.use(/^(?!\/dist\/)/, (req, res, next) => {
            Object.keys(require.cache)
              .filter(pkg => !/[\\/]node_modules[\\/]/.test(pkg))
              .forEach(pkg => {
                delete require.cache[pkg]
              })

            require(buildArtifact).app(env)(req, res, next)
          })
        },
        contentBase: '/',
        host: '0.0.0.0',
        index: '',
        port: env.port,
        publicPath: '/dist/',
        writeToDisk: true
      },
      entry,
      externals: [
        function (context, request, callback) {
          if (isProd) {
            return callback()
          }

          const match = /^([a-z][^/]*|@[a-z][^/]*\/[^/]+)(.*)/i.exec(request)
          if (!match) {
            return callback()
          }

          const pkg = match[1]
          callback(null, `commonjs ${resolve.alias[pkg] || pkg}${match[2]}`)
        }
      ],
      module: {
        rules: rules({ isProd })
      },
      output: {
        ...output,
        libraryTarget: 'commonjs2'
      },
      plugins: [
        new DefinePlugin({
          __DEFAULT_APP_ID__: JSON.stringify(env.app.id),
          __DEFAULT_APP_TITLE__: JSON.stringify(env.app.title),
          'typeof window': JSON.stringify(undefined)
        }),
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
    },
    {
      name: 'client',
      devtool: (isProd)
        ? 'hidden-source-map'
        : 'eval-source-map',
      entry: {
        app: path.resolve(__dirname, 'src', 'client', 'engine'),
        polyfill: path.resolve(__dirname, 'src', 'client', 'polyfill')
      },
      mode,
      module: {
        rules: rules({ isProd, extractCss: true })
      },
      optimization: {
        minimizer: [
          new TerserWebpackPlugin({
            sourceMap: true
          }),
          new OptimizeCSSAssetsWebpackPlugin({})
        ],
        namedChunks: true,
        namedModules: true,
        runtimeChunk: {
          name: 'runtime'
        },
        splitChunks: {
          chunks: 'async',
          minSize: 0
        }
      },
      output: {
        ...output,
        path: path.join(output.path, 'dist'),
        publicPath: '/dist/'
      },
      plugins: [
        new DefinePlugin({
          __DEFAULT_APP_ID__: JSON.stringify(env.app.id),
          __DEFAULT_APP_TITLE__: JSON.stringify(env.app.title),
          'typeof window': JSON.stringify('object')
        }),
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[name].css'
        }),
        new HtmlWebpackPlugin({
          excludeChunks: ['login'],
          filename: 'index.html',
          appId: env.app.id,
          inject: 'head',
          title: env.app.title
          // ...(
          //   fs.existsSync(indexTemplate)
          //     ? {
          //       template: indexTemplate
          //     }
          //     : {}
          // )
        }),
        new ScriptExtHtmlWebpackPlugin({
          defaultAttribute: 'defer'
        })
      ],
      resolve,
      target: 'web',
      watchOptions
    },
    // this is just to generate CSS
    {
      name: 'client',
      devtool: false,
      entry: {
        site: path.join(env.projectRoot, 'src', 'views', 'site')
      },
      mode,
      module: {
        rules: rules({ isProd, extractCss: true })
      },
      optimization: {
        minimizer: [
          new OptimizeCSSAssetsWebpackPlugin({})
        ]
      },
      output: {
        ...output,
        path: path.join(output.path, 'dist'),
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[name].css'
        }),
        new OnBuildPlugin(async (stats) => {
          return exec(`rm -rf ${path.join(output.path, 'dist', 'site.js')}`)
        })
      ],
      resolve,
      stats: {
        // ignore missing site component
        errors: false,
        warnings: false
      },
      target: 'web',
      watchOptions
    }
  ]
}
