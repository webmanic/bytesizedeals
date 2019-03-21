var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var cssbeautify = require('gulp-cssbeautify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');

var DIST_SRC = "src/";

gulp.task('scss:dev', function(callback){
    gulp.src([DIST_SRC + 'scss/**/base.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(concat('theme.css'))
    .pipe(gulp.dest('./css'));
    callback();
    
});

gulp.task('scss:prod', function(callback){
    gulp.src([DIST_SRC + 'scss/**/base.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('theme.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css'));
    callback();
});

gulp.task('script:dev', function(callback){
    gulp.src([DIST_SRC + 'js/app/*.js',
                     DIST_SRC + 'js/run/*.js',
                     DIST_SRC + 'js/route/*.js',
                     DIST_SRC + 'js/config/*.js', 
                     DIST_SRC + 'js/filter/*.js', 
                     DIST_SRC + 'js/service/**/*.js',
                     DIST_SRC + 'js/controller/*.js', 
                     DIST_SRC + 'js/directive/**/*.js'])
    .pipe(concat('all.js'))
    .pipe(rename('script.js'))
    .pipe(gulp.dest('./js'));
    callback();
});

gulp.task('script:prod', function(callback){
    gulp.src([DIST_SRC + 'js/app/*.js',
                     DIST_SRC + 'js/run/*.js',
                     DIST_SRC + 'js/route/*.js',
                     DIST_SRC + 'js/config/*.js', 
                     DIST_SRC + 'js/filter/*.js', 
                     DIST_SRC + 'js/service/**/*.js',
                     DIST_SRC + 'js/controller/*.js', 
                     DIST_SRC + 'js/directive/**/*.js'])
    .pipe(concat('script.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('./js'));
    callback();
});

gulp.task('script:template:dev', function (callback) {
    gulp.src(DIST_SRC + 'js/**/*.html')
    .pipe(gulp.dest('./template'));
    callback();
});

gulp.task('script:template:prod', function (callback) {
    gulp.src(DIST_SRC + 'js/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./template'));
    callback();
});

gulp.task('view:dev', function (callback) {
    gulp.src(DIST_SRC + 'view/*.html')
    .pipe(gulp.dest('./view'));
    callback();
});

gulp.task('view:prod', function (callback) {
    gulp.src(DIST_SRC + 'view/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./view'));
    callback();
});

gulp.task('img:dev', function (callback) {
    gulp.src(DIST_SRC + 'img/**/*')
    .pipe(gulp.dest('./img'));
    callback();
});

gulp.task('img:prod', function (callback) {
    gulp.src(DIST_SRC + 'img/**/*')
    .pipe(gulp.dest('./img'));
    callback();
});

gulp.task('favicon:dev', function (callback) {
    gulp.src(DIST_SRC + 'favicon/*')
    .pipe(gulp.dest('./favicon'));
    callback();
});

gulp.task('favicon:prod', function (callback) {
    gulp.src(DIST_SRC + 'favicon/*')
    .pipe(gulp.dest('./favicon'));
    callback();
});

gulp.task('index:dev', function (callback) {
    gulp.src(DIST_SRC + 'index.html')
    .pipe(gulp.dest('./'));
    callback();
});

gulp.task('index:prod', function (callback) {
    gulp.src(DIST_SRC + 'index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));
    callback();
});

gulp.task('start', function (callback) {
    nodemon({
        script: 'index.js',
        ext: '',
        env: { 'NODE_ENV': 'development' }
    });
    callback();
});

gulp.task('build:desktop:dev', function () {
    gulp.start(['scss:dev','script:dev','script:template:dev','view:dev','img:dev','favicon:dev','index:dev','watch:dev']);
});

gulp.task('build:desktop:prod', function () {
    gulp.start(['scss:prod','script:prod','script:template:prod','view:prod','img:prod','watch:prod','favicon:prod','index:prod']);
});

gulp.task("watch:dev", function(){
    gulp.watch("src/scss/**/*.scss", ['scss:dev']);
    gulp.watch("src/js/**/*.js", ['script:dev']);
    gulp.watch("src/js/**/*.html", ['script:template:dev']);
    gulp.watch("src/view/*.html", ['view:dev']);
    gulp.watch("src/*.html", ['index:dev']);
});

gulp.task("watch:prod", function(){
    gulp.watch("src/scss/**/*.scss", ['scss:prod']);
    gulp.watch("src/js/**/*.js", ['script:prod']);
    gulp.watch("src/js/**/*.html", ['script:template:prod']);
    gulp.watch("src/view/*.html", ['view:prod']);
    gulp.watch("src/*.html", ['index:prod']);
});

gulp.task('prod', ['build:desktop:prod']);

gulp.task('default', ['build:desktop:dev']);