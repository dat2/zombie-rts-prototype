var path = require('path');

var dirs = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  static: path.join(__dirname, 'public')
};

module.exports = {
  paths: {
    src: dirs.src,
    build: dirs.build,
    static: dirs.static
  },
  files: {
    static: dirs.static + '/**',
    build: dirs.build + '/**/*'
  }
};
