const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const PATHS = require('./paths');

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
    })
  ]
});
