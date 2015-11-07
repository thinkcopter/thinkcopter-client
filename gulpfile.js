var fs = require('fs'),
    gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    clean = require('gulp-clean');

function dirExistsSync (d) { 
  try { return fs.statSync(d).isDirectory() } 
  catch (er) { return false } 
}

gulp.task('clean', function(){
  console.log('cleanaling');
  if ( !dirExistsSync('./chrome-app/') ){
    console.log('it\'s not here');
    fs.mkdirSync('./chrome-app');
    return;
  } else {
    console.log('it\'s here');
    return gulp.src('./chrome-app', {read: false})
      .pipe(clean());
  }
});

gulp.task('jshint', ['clean'], function() {
    return gulp.src(['*.js', './src/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish));    
});

gulp.task('copy-js', function(){
  return gulp.src('./src/js/serialport.js')
    .pipe(gulp.dest('./chrome-app'));
});

gulp.task('copy-boiler', function(){
  return gulp.src('./src/chrome-app-boiler-plate/*')
    .pipe(gulp.dest('./chrome-app/'));
});

gulp.task('copy-boiler', function(){
  return gulp.src('./src/chrome-app-boiler-plate/*')
    .pipe(gulp.dest('./chrome-app/'));
});

gulp.task('copy-bootstrap', function(){
  return gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./chrome-app/'));
});

var livereloadServer = null;
var livereload = function (_file) {
  return function (_path) {
    if (livereloadServer) livereloadServer.changed(_file);
  };
};

gulp.task('browserify', ['jshint','copy-js','copy-boiler', 'copy-bootstrap'], function() {
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