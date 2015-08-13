var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/scss/main.scss")
    .pipe(sass())
    .pipe(autoprefixer('last 1 version'))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('src/js/main.js')
    .pipe(browserify())
    .transform(reactify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Static Server + watching scss/html files
gulp.task('assets', ['sass', 'js'], function() {
  browserSync.init({
    host: '0.0.0.0',
    notify: false,
    server: {
        baseDir: "./"
    }
  });

  gulp.watch("src/js/*", ['js'], browserSync.reload);
  gulp.watch("src/scss/*.scss", ['sass']);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('copy', function(){
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['copy', 'assets']);
