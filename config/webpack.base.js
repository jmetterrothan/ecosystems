const path = require('path');
const PATHS = require('./paths');
const webpack = require('webpack');

//plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    bundle: [
      path.join(PATHS.APP, 'index.js'),
      path.join(PATHS.STYLES, 'styles.scss')
    ],
  },
  resolve: {
    modules: ['node_modules', PATHS.SRC],
    extensions: ['.js', '.json', '.scss', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.APP, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      hash: true
    })
  ]
};
