const path = require('path');
const PATHS = require('./paths');

module.exports = {
  "@app": path.resolve(PATHS.APP),
  "@images": path.resolve(PATHS.IMAGES),
  "@shared": path.resolve(PATHS.APP, 'shared'),
  "@assets": path.resolve(PATHS.PUBLIC, 'assets'),
  "@shaders": path.resolve(PATHS.PUBLIC, 'shaders'),
  "@objmodels": path.resolve(PATHS.PUBLIC, 'assets', 'obj'),
  "@utils": path.resolve(PATHS.APP, 'Shared', 'utils'),
  "@world": path.resolve(PATHS.APP, 'World'),
  "@mesh": path.resolve(PATHS.APP, 'Mesh'),
  "@materials": path.resolve(PATHS.APP, 'Shared', 'materials'),
  "@boids": path.resolve(PATHS.APP, 'Boids'),
  "@public": path.resolve(PATHS.PUBLIC),
  "@achievements": path.resolve(PATHS.APP, 'Achievements'),
  "@ui": path.resolve(PATHS.APP, 'UI'),
  "@templates": path.resolve(PATHS.PUBLIC, 'templates')
  "@voice": path.resolve(PATHS.APP, 'Voice'),
  "@online": path.resolve(PATHS.APP, 'online')
};
