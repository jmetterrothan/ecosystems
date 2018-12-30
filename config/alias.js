const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'Shared'),
  "@assets": path.resolve(PATHS.PUBLIC, 'assets'),
  "@shaders": path.resolve(PATHS.PUBLIC, 'shaders'),
  "@objmodels": path.resolve(PATHS.PUBLIC, 'assets', 'obj'),
  "@utils": path.resolve(PATHS.APP, 'Shared', 'utils'),
  "@world": path.resolve(PATHS.APP, 'World'),
  "@mesh": path.resolve(PATHS.APP, 'Mesh'),
  "@materials": path.resolve(PATHS.APP, 'Shared', 'materials')
};
