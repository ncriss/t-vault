var gulp  = require('gulp');
var shell = require('gulp-shell');
var options = {
   'cwd':'Mock'
};
gulp.task('wire-mock-stop', shell.task([ 
   'curl -X POST localhost:9006/__admin/shutdown'
]));
gulp.task('wire-mock-start', shell.task([
   'java -jar wiremock-1.57-standalone.jar --port 9006  --verbose true'
],options));

gulp.task('wire-mock',['wire-mock-start']);