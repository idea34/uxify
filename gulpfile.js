// modules
var gulp  = require('gulp'),
  sass = require('gulp-sass'),
  server = require('gulp-server-livereload'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  npmdist = require('gulp-npm-dist'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  sourcestream = require('vinyl-source-stream'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  buffer = require('vinyl-buffer'),
  autoprefixer = require('autoprefixer'),
  glob = require('glob'),
  eventstream = require('event-stream');

// configs
var theme = 'uxify',
  themedir = 'default',
  version = '1.0.0',
  source = 'src/',
  destination = 'dist/' + version + '/',
  destinationjs = destination + 'js/',
  webdirectory = 'dist/',
  themejs = source + '/' + themedir + '/' + theme + '.js';

// default dev task 
gulp.task('dev', ['build-theme', 'webserver'], function() {
  gulp.watch([source + themedir + '/*.scss'], ['build-theme']);
  gulp.watch([themejs], ['bundlejs']);
});

// browserify compile themejs to bundle
gulp.task('bundlejs', function () {
      var bundler = browserify({
          entries: themejs,
          debug: true
      });
      bundler.transform(babelify);

      bundler.bundle()
          .on('error', function (err) { console.error(err); })
          .pipe(sourcestream(theme + '.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({ loadMaps: true }))
          .pipe(uglify()) // Use any gulp plugins you want now
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(destination));
  });


// build css from sass
gulp.task('build-theme', function() {
  return gulp.src([ source + themedir + '/*.scss'])
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



gulp.task('default', ['build-theme'], function() {
});


// Copy js dependencies (old script tag method)
gulp.task('copyjsdeps', function() {
  gulp.src(npmdist(), {base:'./node_modules/'})
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
    .pipe(gulp.dest(destinationjs));
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
