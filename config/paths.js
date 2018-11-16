const path = require('path');

module.exports = {
  ROOT: path.resolve(__dirname, '../'),
  SRC: path.resolve(__dirname, '../', 'src'),
  DIST: path.resolve(__dirname, '../', 'dist'),
  APP: path.resolve(__dirname, '../', 'src', 'app'),
  PUBLIC: path.resolve(__dirname, '../', 'src', 'public'),
  STYLES: path.resolve(__dirname, '../', 'src', 'styles'),
  ASSETS: path.resolve(__dirname, '../', 'src', 'public', 'assets'),
  SHADERS: path.resolve(__dirname, '../', 'src', 'public', 'shaders')
};
