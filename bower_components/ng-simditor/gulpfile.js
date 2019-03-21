
'use strict';

var gulp = require('gulp'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  babelify = require('babelify');

gulp.task('default', ['js', 'watch']);

gulp.task('js', function() {
  return browserify('./src/js/main.js')
    .transform(babelify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(rename('ng-simditor.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/js/**/*.js'], ['js']);
});
