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

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
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
  return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-build'], function() {
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

gulp.task('scripts', function() {
  return gulp.src(jsIncludes)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./js/'))
    .pipe(gulp.dest('./_site/js/'));
});



/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
  return gulp.src('_sass/main.scss')
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('_site/css/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(['_sass/*.scss', 'css/*.scss'], ['sass']);
  gulp.watch(['*.md','*.html', '_layouts/*.html', '_posts/*', '_includes/*', '_portfolio/*', 'pages/*'], ['jekyll-rebuild']);
  gulp.watch(['assets/**/*.{jpg,png,gif}'], ['jekyll-rebuild']);
  gulp.watch(['_js/**/*.js'], ['scripts']).on('change', browserSync.reload);

});

// /**
//  * Watch for new images and minifiy them
//  */
// gulp.task('imagemin', function () {
//   return gulp.src('assets/**/*.{jpg,png,gif}')
//     .pipe(imagemin())
//     .pipe(gulp.dest('_site/assets/'));
// });



/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);