const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@app": path.resolve(PATHS.APP),
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'shared'),
  "@assets": path.resolve(PATHS.PUBLIC, 'assets'),
  "@shaders": path.resolve(PATHS.PUBLIC, 'shaders'),
  "@objmodels": path.resolve(PATHS.PUBLIC, 'assets', 'obj'),
  "@utils": path.resolve(PATHS.APP, 'shared', 'utils'),
  "@sounds": path.resolve(PATHS.PUBLIC, 'assets', 'sounds'),
  "@world": path.resolve(PATHS.APP, 'world'),
  "@mesh": path.resolve(PATHS.APP, 'mesh'),
  "@materials": path.resolve(PATHS.APP, 'shared', 'materials'),
  "@boids": path.resolve(PATHS.APP, 'boids'),
  "@public": path.resolve(PATHS.PUBLIC),
  "@achievements": path.resolve(PATHS.APP, 'achievements'),
  "@ui": path.resolve(PATHS.APP, 'ui'),
  "@components": path.resolve(PATHS.PUBLIC, 'components'),
  "@templates": path.resolve(PATHS.PUBLIC, 'templates'),
  "@voice": path.resolve(PATHS.APP, 'voice'),
  "@online": path.resolve(PATHS.APP, 'online')
};
