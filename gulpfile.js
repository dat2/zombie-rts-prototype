// NOTE: make sure you have gulp 3.9.0 or above

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var run = require('run-sequence');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./config.js');

// production building
gulp.task('webpack', function (cb) {
  webpack(require('./webpack.config.js'), function (err, stats) {
    if(err) {
      throw new $.util.PluginError('webpack', err);
    }
    $.util.log('[webpack]', stats.toString());
    cb();
  });
});

// development server
var DEV_SERVER = 8080;
gulp.task('webpack-dev-server', function () {
  var compiler = webpack(require('./webpack.config.js'));

  new WebpackDevServer(compiler, {
    // Put in dev server config here
    progress: true,
    colors: true,
    hot: true,
    contentBase: config.paths.build
  })
    .listen(DEV_SERVER, 'localhost', function (err) {
      if(err) {
        throw new $.util.PluginError('webpack-dev-server', err);
      }
      $.util.log('[webpack-dev-server]', 'http://localhost:' + DEV_SERVER + '/webpack-dev-server/index.html');
    });
});

gulp.task('copy:static', function () {
  return gulp.src(config.files.static)
  .pipe($.changed(config.paths.build))
  .pipe(gulp.dest(config.paths.build))
});

gulp.task('clean:dev', function() {
  return del([
    config.files.build
  ]);
})

gulp.task('dev', function () {
  run('clean:dev', ['webpack-dev-server', 'copy:static']);
  gulp.watch(config.files.static, ['copy:static']);
});
