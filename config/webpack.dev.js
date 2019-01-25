const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const PATHS = require('./paths');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: '/'
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    watchContentBase: true,
    open: true
  },
  devtool: 'cheap-eval-source-map',
  plugins: [ ]
});
