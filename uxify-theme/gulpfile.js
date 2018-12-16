// modules
var
  gulp  = require('gulp'),
  sass = require('gulp-sass'),
  sassImportJson = require('gulp-sass-import-json'),
  jsonModify = require('gulp-json-modify'),
  sourcemaps = require('gulp-sourcemaps'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  gulpif = require('gulp-if'),
  minimist = require('minimist'),
  fs = require("fs"),
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
var themesdir = './themes/';
var themepath = themesdir + theme + '/';
var themejs = themepath + theme + '.js';
var buildsdir = './builds/';


//versioning
try {
  var config = JSON.parse(fs.readFileSync(themepath + '_theme-config.json'));
}
catch (err) {
  var config = false;
}

  // version default
  if(config) {
    themeversion = config.version;
    jsDir = config.js;
    cssDir = config.css;
    imgDir = config.images;
    fontDir = config.fonts;
    assetDir = config.assets;
  } else {
    themeversion = '1.0.0';
    jsDir = "js/";
    cssDir = "css/";
    imgDir = false;
    fontDir = false;
    assetDir = false;
  }

  // map build version
  var
    themebuild = buildsdir + theme + '/' + themeversion + '/';


// tasks

gulp.task('bundle-images', function() {
  if(imgDir) {
    return gulp.src(themepath + imgDir + '**/*')
      .pipe(gulp.dest(themebuild + imgDir ));
  }
});

gulp.task('bundle-fonts', function() {
  if(fontDir) {
    return gulp.src(themepath + fontDir + '**/*')
      .pipe(gulp.dest(themebuild + fontDir ));
  }
});

gulp.task('bundle-assets', function() {
  if(assetDir) {
    return gulp.src(themepath + assetDir + '**/*')
      .pipe(gulp.dest(themebuild + assetDir ));
  }
});

gulp.task('bundle-html', function() {
  return gulp.src(themepath + '**/*.html')
    .pipe(gulp.dest(themebuild));
});

gulp.task('bundle-css', function() {
  return gulp.src([ themepath + '*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sassImportJson())
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
    .pipe(gulp.dest(themebuild + cssDir))
});

gulp.task('dev', ['bundle-css', 'bundle-js', 'bundle-html', 'bundle-images', 'bundle-fonts', 'bundle-assets', 'view'],  function() {
  gulp.watch([themepath + '*.scss', themepath + '*.json'], ['bundle-css']);
  gulp.watch([themepath + '*.html'], ['bundle-html']);
  gulp.watch([themepath + imgDir + '**/*'], ['bundle-images']);
  gulp.watch([themepath + fontDir + '**/*'], ['bundle-fonts']);
  gulp.watch([themepath + assetDir + '**/*'], ['bundle-assets']);
  gulp.watch([themejs], ['bundle-js']);
  console.log( 'Working on theme: ' + options.theme + " version: " + themeversion );
});

gulp.task('build', ['bundle-css', 'bundle-js', 'bundle-html', 'bundle-images', 'bundle-fonts', 'bundle-assets'],  function() {
  console.log( 'Building theme: ' + options.theme + " version: " + themeversion );
  gulp.start('bundle-css');
  gulp.start('bundle-js');
  gulp.start('bundle-html');
  gulp.start('bundle-images');
  gulp.start('bundle-fonts');
  gulp.start('bundle-assets');
});

gulp.task('default', ['dev'], function() {
  console.log('Theme preview started!');
});

gulp.task('create', function() {
  var name, i = process.argv.indexOf("--theme");
    if(i>-1) {
        name = process.argv[i+1];
        path = themesdir + name;

        //
        if( name === 'starter' || name === 'uxify') { return console.log ('That name is taken.'); }

        // copy
        gulp.src([ themesdir + 'starter/**', '!themes/starter/starter.js', '!themes/starter/starter.scss'], {
            // base: 'src'
        })
        .pipe(gulp.dest( path ));

        // create js
        gulp.src('themes/starter/starter.js')
        .pipe(rename(name + '.js'))
        .pipe(gulp.dest(path));

        // create scss
        gulp.src('themes/starter/starter.scss')
        .pipe(rename(name + '.scss'))
        .pipe(gulp.dest(path));

        // update theme config with name
        gulp.src('themes/starter/_theme-config.json')
        .pipe(jsonModify({ key: 'name', value: name }))
        .pipe(gulp.dest(path));


    } else {
      console.log('Use \'gulp create --theme [your-theme-name]\'');
    }
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
          .pipe(gulp.dest(themebuild + jsDir ));
  });

//
// #### dev server
// options: https://www.npmjs.com/package/gulp-server-livereload
gulp.task('view', function() {
  gulp.src( themebuild  )
    .pipe(server({
      livereload: true,
      open: true,
      port: 8180,
      defaultFile: 'index.html',
      fallback: 'index.html'
    }));
});
