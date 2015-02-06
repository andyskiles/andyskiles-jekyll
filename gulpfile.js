var gulp = require('gulp'),
    
    // jekyll plugins
    spawn = require('child_process').spawn,

    // other plugins
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    sfx = require("sfx");
    
    // css plugins
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer-core'),

    // js plugins
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
 




// Run Jekyll Build Asynchronously
gulp.task('jekyll', function () {
    var jekyll = spawn('jekyll', ['build']);
     
    jekyll.stdout.on('data', function (data) {
        console.log('jekyll:\t' + data);
    });
});





// Run webserver
gulp.task('webserver', function() {
  gulp.src('_site')
    .pipe(webserver({
      livereload: true,
      port: 1212,
      directoryListing: false,
      open: true
    }));
});
 
 



// Compile SASS
gulp.task('styles', function() {
  return sass('development/scss/main.scss', {
    require: "susy",
    style: "expanded"
  })
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 version'] }) ]))
    .pipe(gulp.dest('site_assets/css'))
    .pipe(
        notify({ message: 'Styles done' }),
        sfx.play("node_modules/sfx/sounds/Donuts.aiff"));
});




// Scripts
gulp.task('scripts', function() {
  return gulp.src('development/js/main.js')
    .pipe(concat('main.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('site_assets/js/'))
    .pipe(notify({ message: 'Scripts done mayne' }));
});
 
 



// Watch for changes
gulp.task('watch', function () {
    // Watch .scss files
    gulp.watch('development/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('development/js/main.js', ['scripts']);

    // Watch .html files
    gulp.watch(['_layouts/**', 'index.html', 'vault/index.html', '_includes/**', '_posts/**', 'site_assets/**'], ['jekyll']);

    // Watch site assets
    gulp.watch(['site_assets/**'], ['jekyll']);
})
 
 



gulp.task('default', ['styles', 'scripts', 'jekyll', 'webserver', 'watch']);






