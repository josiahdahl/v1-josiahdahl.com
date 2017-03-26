/**
 * Created by jdahl on 5/6/16.
 */

// Gulpfile based on https://github.com/shakyShane/jekyll-gulp-sass-browser-sync

var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var cp = require('child_process');
var concat = require('gulp-concat');

var gulpsync = require('gulp-sync')(gulp);
var uglify = require('gulp-uglify');
var nano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

var rsync = require('gulp-rsync');
var config = require('./_config.json');


var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var jsIncludes = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/Materialize/dist/js/materialize.js',
    '_js/app.js'
];


/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function (done) {
    browserSync.reload();
    done();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-build'], function () {
    browserSync({
        server: {
            baseDir: '_site'
        },
        open: false
    });
});

/**
 * Concat JS Files
 */

gulp.task('scripts', function () {
    return gulp.src(jsIncludes)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./js/'))
        .pipe(gulp.dest('./_site/js/'));
});

gulp.task('js-watch', ['scripts'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('uglify', function () {
    return gulp.src('_site/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('_site/js/'));
});

gulp.task('minify', function () {
    return gulp.src('_site/css/main.css')
        .pipe(nano())
        .pipe(gulp.dest('_site/css/'));
});


/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(prefix(['last 15 versions', '> 1%'], {cascade: true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('_site/css/'))
        .pipe(browserSync.stream())
        .pipe(gulp.dest('css'));
});


/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_sass/*.scss', 'css/*.scss'], ['sass']);
    gulp.watch(['*.md', '*.html', '_layouts/*.html', '_posts/*', '_includes/*', '_portfolio/*', 'pages/*'], ['jekyll-rebuild']);//.on('change', browserSync.reload);
    gulp.watch(['assets/**/*.{jpg,png,gif}'], ['jekyll-rebuild']);
    gulp.watch(['_js/**/*.js'], ['js-watch']);

});

/**
 * Watch for new images and minifiy them
 */
gulp.task('imagemin', function () {
    return gulp.src('_site/assets/**/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('_site/assets/'));
});

/**
 * Deploy to server
 */

gulp.task('upload', function () {
    return gulp.src(config.rsync.src)
        .pipe(rsync(config.rsync.options))
})

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

var buildTasks = ['sass', 'scripts', 'jekyll-build', 'imagemin', 'minify', 'uglify'];
gulp.task('build', gulpsync.sync(buildTasks));