'use strict'

const childProcess = require('child_process')
// const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const { DefinePlugin } = require('webpack')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const env = require('./env')

const exec = promisify(childProcess.exec.bind(childProcess))

class OnBuildPlugin {
  constructor(fn) {
    this.fn = fn
  }

  apply(compiler) {
    compiler.hooks.done.tap('OnBuildPlugin', this.fn)
  }
}

const entry = {
  server: ['source-map-support/register', './src/server']
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
        name: isProd
          ? 'dist/assets/[hash].[ext]'
          : 'dist/assets/[path][name].[ext]',
        publicPath: '/'
      }
    }
  },
  {
    test: /\.s?[ac]ss$/,
    use: (extractCss ? [{ loader: MiniCssExtractPlugin.loader }] : []).concat({
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: isProd ? '[hash:base64]' : '[path][name]__[local]',
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
    use: ['babel-loader']
  },
  {
    test: /\.svg$/,
    use: ['babel-loader', 'react-svg-loader', 'svgo-loader']
  }
]

const watchOptions = {
  ignored: /[\\/]node_modules[\\/]/
}

const buildArtifact = path.resolve(output.path, Object.keys(entry)[0])

module.exports = (_, argv) => {
  const isProd = env.isProd || /^prod/i.test(argv.mode)

  const mode = isProd ? 'production' : 'development'

  const clientConfig = {
    name: 'client',
    devtool: isProd ? 'hidden-source-map' : 'eval-source-map',
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
      // namedChunks: true,
      // namedModules: true,
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
        __PRODUCTION__: JSON.stringify(isProd),
        'typeof window': JSON.stringify('object'),
        __DEFAULT_APP_ID__: JSON.stringify(env.app.id),
        __DEFAULT_APP_TITLE__: JSON.stringify(env.app.title)
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css'
      })
    ],
    resolve: {
      ...resolve,
      alias:
        isProd && env.isPreact
          ? {
              ...resolve.alias,
              react: 'preact/compat',
              'react-dom': 'preact/compat'
            }
          : resolve.alias
    },
    target: 'web',
    watchOptions
  }

  return [
    {
      name: 'server',
      devServer: {
        before: app => {
          app.use(/^(?!\/dist\/)/, (req, res, next) => {
            // require on each request because the cache may have been cleared
            require(buildArtifact).app()(req, res, next)
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
        function(context, request, callback) {
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
          __PRODUCTION__: JSON.stringify(isProd),
          'typeof window': JSON.stringify(undefined),
          __DEFAULT_APP_ID__: JSON.stringify(env.app.id),
          __DEFAULT_APP_TITLE__: JSON.stringify(env.app.title),
          __PRIVATE_APP__: JSON.stringify(true)
        }),
        ...(isProd
          ? []
          : [
              new OnBuildPlugin(async stats => {
                Object.keys(require.cache)
                  .filter(pkg => !/[\\/]node_modules[\\/]/.test(pkg))
                  .forEach(pkg => {
                    delete require.cache[pkg]
                  })
              })
            ])
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
      ...clientConfig,
      entry: {
        // 'site' entry is just to compile the site-wide CSS
        site: path.join(env.projectRoot, 'src', 'views', 'site'),
        polyfills: path.resolve(__dirname, 'src', 'client', 'polyfills'),
        app: path.resolve(__dirname, 'src', 'client', 'engine'),
        'polyfills/assign': 'core-js/features/object/assign',
        'polyfills/fetch': 'whatwg-fetch',
        'polyfills/includes': 'core-js/features/array/includes',
        'polyfills/map': 'core-js/features/map',
        'polyfills/promise': 'core-js/features/promise',
        'polyfills/set': 'core-js/features/set'
      },
      plugins: [
        new DefinePlugin({
          __PRIVATE_APP__: JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
          chunks: ['site', 'polyfills', 'app'],
          excludeAssets: [/site\.js$/],
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
        new HtmlWebpackExcludeAssetsPlugin(),
        new ScriptExtHtmlWebpackPlugin({
          defaultAttribute: 'defer'
        }),
        new OnBuildPlugin(async stats => {
          // delete the unused site script
          return exec(`rm -rf ${path.join(output.path, 'dist', 'site.js')}`)
        }),
        ...clientConfig.plugins
      ]
    },
    // build a smaller payload for unauthenticated visitors
    {
      ...clientConfig,
      entry: {
        www: path.resolve(__dirname, 'src', 'client', 'engine')
      },
      plugins: [
        new DefinePlugin({
          __PRIVATE_APP__: JSON.stringify(false)
        }),
        ...clientConfig.plugins
      ]
    }
  ]
}
