const path = require('path');
const PATHS = require('./paths');
const alias = require('./alias');
const webpack = require('webpack');
const webpackMode = require('webpack-mode');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    bundle: [
      path.join(PATHS.SRC, 'index.ts'),
      path.join(PATHS.STYLES, 'styles.scss')
    ]
  },
  resolve: {
    modules: ['node_modules', PATHS.SRC],
    extensions: ['.ts', '.js', '.json', '.scss', '.css'],
    alias: {
      ...alias,
      three$: 'three/build/three.min.js',
      'three/.*$': 'three'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: '/node_modules/',
        loader: 'tslint-loader'
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          webpackMode.isDevelopment
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: webpackMode.isProduction
                ? '/images/[name]_[hash:8].[ext]'
                : '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.(obj|mtl)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.SRC, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(webpackMode.isDevelopment ? 'development' : 'production')
      }
    })
  ]
};
