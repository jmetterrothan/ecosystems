const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'Shared')
};
