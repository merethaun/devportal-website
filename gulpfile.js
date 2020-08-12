const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');

// CSS task
function css() {
  var plugins = [
    autoprefixer()
  ];
  return gulp.src('./style/main.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
}

function watchFiles() {
  gulp.watch("./style/**/*.styl", { interval: 750 }, gulp.series(css));
}

const defaultTask = css;

  exports.css = css;
  exports.watch = watch;
  exports.default = defaultTask;