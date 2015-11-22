var gulp = require('gulp-help')(require('gulp'));
var $ = require('gulp-load-plugins')();
var del = require('del');
var run = require('run-sequence');
var push = require('git-push');

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
gulp.task('webpack:server', function () {
  var compiler = webpack(require('./webpack.config.js'));

  new WebpackDevServer(compiler, {
    // Put in dev server config here
    progress: true,
    colors: true,
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
    .pipe(gulp.dest(config.paths.build));
});

gulp.task('clean', function() {
  return del(config.files.build);
});

gulp.task('dev', function () {
  run('clean', ['webpack:server', 'copy:static']);
  gulp.watch(config.files.static, ['copy:static']);
});

gulp.task('build', ['clean'], function(cb) {
  run(['webpack', 'copy:static']);
  cb();
});

gulp.task('deploy', function(cb) {
  run('build');
  push(config.paths.build, { name: 'origin', url: 'https://git.heroku.com/zombie-rts-prototype.git', branch: 'master' }, cb);
});
