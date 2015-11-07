var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    clean = require('gulp-clean');

gulp.task('clean', function(){
  return gulp.src('./chrome-app/', {read: false})
    .pipe(clean());
});

gulp.task("jshint", function() {
  return gulp.src(['*.js', './src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish));
});


gulp.task('copy-js', function(){
  return gulp.src('./src/js/serialport.js')
    .pipe(gulp.dest('./chrome-app/'));
});

gulp.task('copy-boiler', function(){
  return gulp.src('./src/chrome-app-boiler-plate/*')
    .pipe(gulp.dest('./chrome-app/'));
});

var livereloadServer = null;
var livereload = function (_file) {
  return function (_path) {
    if (livereloadServer) livereloadServer.changed(_file);
  };
};

gulp.task('browserify', ['clean','jshint','copy-js','copy-boiler'], function() {
  return gulp.src(['./src/js/app.js'])
    .pipe(browserify({ debug : true, "fullPaths": true }))
    .pipe(gulp.dest('./chrome-app/'))
    .on('end', livereload('.js'));
});

gulp.task('watch', ['build'], function() {

  livereloadServer = require('gulp-livereload')();

  gulp.watch(['./src/**/*.js', './*.js'], ['build']);

});

gulp.task('build', ['browserify']);

gulp.task('default', ['watch']);