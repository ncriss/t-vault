var htmlhint = require( "gulp-htmlhint" );
var gulp = require( 'gulp' );

gulp.task('html-lint',function(){
    return gulp.src( "src/app/**/*.html" )
        .pipe( htmlhint('.htmlhintrc') )
        .pipe( htmlhint.reporter( 'htmlhint-stylish' ) )
        .pipe( htmlhint.failReporter());
});
