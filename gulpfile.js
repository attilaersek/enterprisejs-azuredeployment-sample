var gulp = require('gulp');
var tslint = require('gulp-tslint');
var exec = require('child_process').exec;
var jasmine = require('gulp-jasmine');
var gulp = require('gulp-help')(gulp);
var tsconfig = require('gulp-tsconfig-files');
var path = require('path');
var inject = require('gulp-inject');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var dtsGenerator = require('dts-generator');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var cp = require('child_process');
var typings = require("gulp-typings");
var zip = require("gulp-zip");

require('dotbin');

var tsFilesGlob = (function (c) {
  return c.filesGlob || c.files || '**/*.ts';
})(require('./tsconfig.json'));

var appName = (function (p) {
  return p.name;
})(require('./package.json'));

gulp.task('update-tsconfig', 'Update files section in tsconfig.json', function () {
  gulp.src(tsFilesGlob).pipe(tsconfig());
});

gulp.task('clean', 'Cleans the generated js files from target directory', function () {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('tslint', 'Lints all TypeScript source files', function () {
  return gulp.src(tsFilesGlob)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('gen-def', 'Generate a single .d.ts bundle containing external module declarations exported from TypeScript module files', function (cb) {
  return dtsGenerator.default({
    name: appName,
    project: '.',
    out: './dist/' + appName + '.d.ts',
    exclude: ['node_modules/**/*.d.ts', 'typings/**/*.d.ts']
  });
});

gulp.task('typings', 'Install typings', function () {
   return gulp.src("./typings.json")
     .pipe(typings()); 
});

gulp.task('compile', 'INTERNAL TASK - Compiles all TypeScript source files', function (cb) {
  return exec('tsc', function (err, stdout, stderr) {
    console.log(stdout);
    if (stderr) {
      console.log(stderr);
    }
    cb(err);
  });
});

gulp.task('compress', function(cb) {
	return gulp.src(['**'])
		.pipe(zip('deployment.zip'))
		.pipe(gulp.dest('dist'));
});

//run tslint task, then run update-tsconfig and gen-def in parallel, then run _build
gulp.task('build', 'Compiles all TypeScript source files and updates module references', gulpSequence('typings', 'tslint', 'update-tsconfig', 'gen-def', 'compile'));
gulp.task('rebuild', 'Cleans the target folder and builds', gulpSequence('clean', 'build'));
gulp.task('deploy', 'deploy', gulpSequence('build', 'compress'));

gulp.task('test', 'Runs the Jasmine test specs', ['build'], function () {
  return gulp.src('test/*.js')
    .pipe(jasmine());
});

gulp.task('browser-sync', ['nodemon', 'watch'], function () {
    browserSync.init(null, {
        proxy: "http://localhost:1337",
        files: ["src/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

gulp.task('nodemon', function (cb) {
    var started = false;

    return nodemon({
        script: 'dist/server.js',
        watch: ['dist/**/*.*']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function onRestart() {
        setTimeout(function reload() {
            browserSync.reload({
                stream: false
            });
        }, 500);  // browserSync reload delay
    });
});

gulp.task('watch', 'Watches ts source files and runs build on change', function () {
  gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('default', gulpSequence('build', 'browser-sync'));