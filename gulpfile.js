// modules
var gulp  = require('gulp'),
  sass = require('gulp-sass'),
  server = require('gulp-server-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer');

// configs
var theme = 'default',
  version = '1.0.0',
  source = 'src/',
  destination = 'dist/' + version + '/',
  webdirectory = 'dist/';



gulp.task('build-theme', function() {
  return gulp.src([ source + theme + '/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer({ browsers: [
      'Chrome >= 35',
      'Firefox >= 38',
      'Edge >= 12',
      'Explorer >= 10',
      'iOS >= 8',
      'Safari >= 8',
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12']})]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destination))
    .pipe(cleanCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destination))
});

gulp.task('dev', ['build-theme', 'webserver'], function() {
  gulp.watch([source + theme + '/*.scss'], ['build-theme']);
  gulp.watch(webdirectory);
  return gulp.start(['webserver']);
});

gulp.task('default', ['build-theme'], function() {
});


//
// #### dev server
// options: https://www.npmjs.com/package/gulp-server-livereload
gulp.task('webserver', function() {
  gulp.src( webdirectory )
    .pipe(server({
      livereload: true,
      open: true,
      port: 8180,
      defaultFile: 'index.html',
      fallback: 'index.html'
    }));
});
