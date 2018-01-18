
var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');

gulp.task('scss-lint', function() {
    return gulp.src('src/app/**/*.scss')
        .pipe(scsslint())
        .pipe(scsslint.failReporter());
});