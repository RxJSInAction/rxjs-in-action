/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const gulp = require('gulp');
const connect = require('gulp-connect');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const api = require('./api');

gulp.task('default', ['connect', 'watch']);

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('connect', function() {

  connect.server({
    root: 'app',
    livereload: true,
    middleware: function(app, opts) {
      return [
        // Gets our static assets
        serveStatic('app'),
        // Serves our node_modules as static assets as well
        serveStatic('node_modules/'),
        // Try parsing the incoming content as json
        bodyParser.json(),

        // Add some api endpoints
        ['/rest/api/', api]
      ];
    }
  });
});