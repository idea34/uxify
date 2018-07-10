// modules
var
  gulp  = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  gulpif = require('gulp-if'),
  minimist = require('minimist'),
  // js
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  buffer = require('vinyl-buffer'),
  sourcestream = require('vinyl-source-stream'),
  // webserver
  server = require('gulp-server-livereload');

// define current theme by command line
// gulp dev --theme uxify
//
var themes = {
  string: 'theme',
  default: { theme: process.theme || 'starter' } // default theme
};

var options = minimist(process.argv.slice(2), themes);
var theme = options.theme;


// build configs
//
var
  themesdir = './themes/',
  themepath = themesdir + theme + '/',
  themejs = themepath + theme + '.js';

  //versioning
  var fs = require("fs");
  var config = JSON.parse(fs.readFileSync(themepath + '_theme-config.json'));

  // default
  if(config) {
    themeversion = config.version;
  } else {
    themeversion = '1.0.0';
  }

  // map build version
  var
    themebuild = themepath + 'build/' + themeversion + '/';


// tasks

gulp.task('build-theme', function() {
  return gulp.src([ themepath + '*.scss'])
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
    .pipe(gulp.dest(themebuild + 'css/'))
    .pipe(cleanCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(themebuild + 'css/'))
});

gulp.task('dev', ['build-theme', 'bundle-js', 'webserver'],  function() {
  gulp.watch([themepath + '*.scss'], ['build-theme']);
  gulp.watch([themejs], ['bundle-js']);
  console.log( 'working on theme: ' + options.theme + " version: " + themeversion );
});

gulp.task('default', ['dev'], function() {

});

// browserify compile themejs to bundle
gulp.task('bundle-js', function () {
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
          .pipe(gulp.dest(themebuild + 'js/'));
  });

//
// #### dev server
// options: https://www.npmjs.com/package/gulp-server-livereload
gulp.task('webserver', function() {
  gulp.src( themebuild  )
    .pipe(server({
      livereload: true,
      open: true,
      port: 8180,
      defaultFile: 'index.html',
      fallback: 'index.html'
    }));
});
