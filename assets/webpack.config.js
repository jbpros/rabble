'use strict'

// Based on http://pggalaviz.com/2017/05/28/phoenix-vue-and-webpack/

// Modules
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Environment
const Env = process.env.MIX_ENV || 'dev'
const isProd = Env === 'prod'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// eslint-disable-next-line no-unused-vars
module.exports = env => {
  const devtool = isProd ? '#source-map' : '#cheap-module-eval-source-map'

  return {
    devtool: devtool,
    entry: {
      app: './js/app.js',
    },
    output: {
      path: path.resolve(__dirname, '../priv/static'),
      filename: 'js/[name].js',
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.css', '.scss', '.styl'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              css: ExtractTextPlugin.extract({
                use: ['css-loader', 'sass-loader', 'stylus-loader'],
                fallback: 'vue-style-loader',
              }),
            },
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!animateplus)/,
          loader: 'babel-loader',
          include: [
            resolve('js'),
            resolve('vendor'),
            resolve('test'),
            resolve('node_modules/animateplus'),
          ],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /node_modules/,
          loaders: [
            'file-loader?name=images/[name].[ext]',
            {
              loader: 'image-webpack-loader',
              options: {
                query: {
                  mozjpeg: {
                    progressive: true,
                  },
                  gifsicle: {
                    interlaced: true,
                  },
                  optipng: {
                    optimizationLevel: 7,
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4,
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(ttf|woff2?|eot|svg)$/,
          exclude: /node_modules/,
          query: { name: 'fonts/[hash].[ext]' },
          loader: 'file-loader',
        },
      ],
    },
    plugins: isProd
      ? [
          new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true,
          }),
          new CopyWebpackPlugin([
            {
              from: './static',
              to: path.resolve(__dirname, '../priv/static'),
              ignore: ['.*'],
            },
          ]),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
            sourceMap: true,
            beautify: false,
            comments: false,
          }),
        ]
      : [
          new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks: true,
          }),

          new CopyWebpackPlugin([
            {
              from: './static',
              to: path.resolve(__dirname, '../priv/static'),
              ignore: ['.*'],
            },
          ]),
        ],
  }
}
