const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const PATHS = require('./paths');

const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: PATHS.DIST,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(PATHS.DIST, {
      root: PATHS.ROOT,
      verbose: true
    }),
    new CompressionPlugin({
      threshold: 8192,
      minRatio: 0.8
    })
  ]
});
