const path = require('path');
const PATHS = require('./paths');
const webpackMode = require('webpack-mode');

//plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        test: /\.(scss|sass)$/,
        use: [
          webpackMode.isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
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
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
