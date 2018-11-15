const path = require('path');
const PATHS = require('./paths');
const webpack = require('webpack');

module.exports = {

  entry: {
    bundle: [
      path.join(PATHS.APP, 'index.js')
    ],
    resolve: {

    },
    module: {

    },
    plugins: {

    }
  }

};
