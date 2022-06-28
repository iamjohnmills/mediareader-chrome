var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var pipeline = require('readable-stream').pipeline;
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var zip = require('gulp-zip');
var clean = require('gulp-clean');

gulp.task('task_scripts',function(){
  return gulp.src(['./MediaReader.js', './store.js', './app.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(javascriptObfuscator({compact: true}))
    .pipe(gulp.dest('./out'));
})

gulp.task('task_cssmin', function(){
  return gulp.src('./app.css')
    .pipe(csso())
    .pipe(gulp.dest('./out'));
})

gulp.task('task_htmlmin', function(){
  return gulp.src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./out'))
})

gulp.task('task_bundle', gulp.series(['task_scripts', 'task_cssmin','task_htmlmin'], function(){
  return gulp.src(['./out/app.js', './out/app.css', './out/index.html', './manifest.json', './main.js', './icon-16x16.png', './icon-48x48.png', './icon-128x128.png'])
    .pipe(gulp.dest('./deploy/bundle'))
}))

gulp.task('task_deploy', gulp.series('task_bundle', function(){
  return gulp.src('./deploy')
		.pipe(zip('mediareader.zip'))
		.pipe(gulp.dest('./deploy'))
}))

gulp.task('build', gulp.series('task_deploy', function(){
  return gulp.src('./out', {read: false}).pipe(clean());
}))
