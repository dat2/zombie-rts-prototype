var path = require('path');

var dirs = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  static: path.join(__dirname, 'static')
};

module.exports = {
  paths: {
    src: dirs.src,
    build: dirs.build,
    static: dirs.static,
    out: path.join(dirs.build,'public')
  },
  files: {
    static: [dirs.static + '/**', path.join(__dirname, 'package.json')],
    build: [dirs.build + '/**/*', '!' + dirs.build + '/.git']
  }
};
