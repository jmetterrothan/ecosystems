const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'Shared'),
  "@utils": path.resolve(PATHS.APP, 'Shared', 'utils'),
  "@world": path.resolve(PATHS.APP, 'World')
};
