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
const nodeResolve = require('rollup-plugin-node-resolve');

// Our modules
const api = require('./api');

gulp.task('default', ['build', 'connect', 'watch']);
gulp.task('build', ['rollup', 'copy']);

let cache = null;

gulp.task('rollup', function() {

  return rollup({
    entry: './app/js/runtime.js',
    sourceMap: true,
    format: 'iife',
    plugins: [babel({
      exclude: 'node_modules/**'
    })],
    globals: {
      'rxjs': 'Rx',
      'jquery': '$',
      'codemirror': 'CodeMirror'
    },
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

gulp.task('copy', function() {
  gulp.src(['./app/*.html', './app/**/*.css'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(
    ['./app/*.html', './app/css/*.css', './app/js/**/**.js'],
    ['rollup', 'html', 'copy']);
});

gulp.task('connect', function() {

  connect.server({
    root: 'app',
    livereload: true,
    middleware: function(app, opts) {
      return require('./middleware');
    }
  });
});
