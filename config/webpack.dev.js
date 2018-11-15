const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const PATHS = require('./paths');

module.exports = merge(baseConfig, {
  mode: 'development'
});
