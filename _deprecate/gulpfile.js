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
  svgsprite = require("gulp-svg-sprites"),
  googleWebFonts = require('gulp-google-webfonts'),
  buffer = require('vinyl-buffer'),
  sourcestream = require('vinyl-source-stream'),
  browserify = require('browserify'),
  babelify = require('babelify'),
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
  destinationicons = destination + 'icons/',
  destinationfonts = destination + 'fonts/',
  webdirectory = 'dist/',
  themepath = source + '/' + themedir + '/';
  themejs = themepath + theme + '.js';
  themeassets = themepath + 'assets/';
  themeicons = themeassets + 'icons/';
  themefonts = themeassets + 'fonts/';

// add google web fonts
gulp.task('fonts', function () {
	return gulp.src(themefonts + 'fonts.list')
		.pipe(googleWebFonts({
    	cssFilename: theme + '-fonts.css'
    }))
		.pipe(gulp.dest(destinationfonts))
		;
});

// icon font from svg sprite
gulp.task('icons', function () {
    return gulp.src(themeicons + '**/*.svg')
        .pipe(svgsprite({
          selector: "icon-%f",
          baseSize: 14,
          "cssFile": theme + "-icons.css",
          "svgPath": "%f",
          svg: {
                sprite: theme + "-icons.svg"
          },
          preview: {
              sprite: "index.html"
          }

        }))
        .pipe(gulp.dest(destinationicons));
});

// default dev task
gulp.task('dev', ['build-theme', 'webserver', 'icons', 'fonts'], function() {
  gulp.watch([source + themedir + '/*.scss'], ['build-theme']);
  gulp.watch([themejs], ['bundlejs']);
  gulp.watch([themeicons], ['icons']);
  gulp.watch([themefonts + 'fonts.list'], ['fonts']);
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
          .pipe(gulp.dest(destinationjs));
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



gulp.task('default', ['dev'], function() {
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
