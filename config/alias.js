const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'Shared'),
  "@assets": path.resolve(PATHS.PUBLIC, 'assets'),
  "@objmodels": path.resolve(PATHS.PUBLIC, 'assets', 'obj'),
  "@utils": path.resolve(PATHS.APP, 'Shared', 'utils'),
  "@world": path.resolve(PATHS.APP, 'World')
};
