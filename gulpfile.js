var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

gulp.task('sass', function() {
    return gulp.src('./resources/assets/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(concat('app.css'))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('js', function() {
    return gulp.src('./resources/assets/js/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
  gulp.watch('./resources/assets/sass/*.scss', ['sass']);
  gulp.watch('./resources/assets/js/app.js', ['js']);
});

gulp.task('default', ['sass']);