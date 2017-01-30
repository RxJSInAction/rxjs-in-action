/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

// Gulp
const gulp = require('gulp');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');

// Http server stuff
const proxy = require('http-proxy-middleware');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');

// Rollup
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('rollup-plugin-babel');

// Our modules
const api = require('./api');

gulp.task('default', ['rollup', 'connect', 'watch']);

let cache = null;

gulp.task('rollup', function() {

  return rollup({
    entry: './app/js/runtime.js',
    sourceMap: true,
    format: 'iife',
    plugins: [babel()],
    cache: cache
  })
    .on('bundle', function(bundle) {
      cache = bundle;
    })
    .pipe(source('runtime.js', './app/js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html', './app/js/**/**.js'], ['rollup', 'html']);
});

gulp.task('connect', function() {

  const yahooProxyOptions = {
    target: 'http://download.finance.yahoo.com',
    changeOrigin: true,
    pathRewrite: {
      '^/external/yahoo': ''
    }
  };

  const wikipediaProxyOptions = {
    target: 'https://en.wikipedia.org',
    changeOrigin: true,
    pathRewrite: {
      '^/external/wikipedia': ''
    }
  };

  connect.server({
    root: 'app',
    livereload: true,
    middleware: function(app, opts) {
      return [
        // Proxy searches to the yahoo finance APIs to avoid CORS issues
        proxy('/external/yahoo', yahooProxyOptions),
        proxy('/external/wikipedia', wikipediaProxyOptions),
        // Gets our static assets
        serveStatic('dist'),
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
