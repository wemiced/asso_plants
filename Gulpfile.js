/* ## Dependencies
================================================== */

  var gulp          = require('gulp');
  var sass          = require('gulp-sass');
  var livereload    = require('gulp-livereload');
  var svgmin        = require('gulp-svgmin');
  var runSequence   = require('gulp-run-sequence');
  var concat        = require('gulp-concat');
  var jsmin         = require('gulp-jsmin');
  var del           = require('del');
  var rename        = require('gulp-rename');
  var connect       = require('gulp-connect');
  var gzip          = require('gulp-gzip');
  var open          = require('gulp-open');
  var inject        = require('gulp-inject');
  var minifyCss     = require('gulp-minify-css');
  var imagemin      = require('gulp-imagemin');
  var pngquant      = require('imagemin-pngquant');

/* ## Paths
================================================== */

  var paths = {

      serve : {
        port: '8000',
        root: './public'
      },

      files: {
        watch: ['./src/assets/fonts/*', './src/index.html', './src/datas/association.js', './src/scripts/app.js']
      },
      styles: {
          files:  './src/styles/*.scss',
          dest: './public/styles/',
          watch: './src/styles/**/*.scss'
      },
      jsminifier: {
          files: './src/vendor/*.js',
          dest: './src/vendor/min/',
          watch: './src/vendor/*.js'
      },
      jsconcat : {
        files: './src/vendor/min/*.js',
        filename: 'vendor.min.js',
        dest: './public/vendor/'
      },
      assets : {
        files: ['./src/assets/**/*{png,svg}','!./src/assets/fonts/'],
        dest: './public/assets/',
        watch: './src/assets/**/*',
        clean: './public/assets/**/*'
      }
  }

/* ## clean
================================================== */

  gulp.task('clean:all', function (cb) {
    return del(['./public'], cb );
  });

  gulp.task('clean:svg', function (cb) {
    return del([paths.svgmin.clean], cb );
  });


/* ## serve
================================================== */

gulp.task('serve', function() {

    connect.server({
        port:paths.serve.port,
        root: paths.serve.root
    });

});

/* ## open
================================================== */

gulp.task('open', function(){

  gulp.src('')
  .pipe(open({uri: 'http://localhost:' + paths.serve.port}));

});

/* ## displayErrors instead of crash
================================================== */

  var displayError = function(error) {

      var errorString = '[' + error.plugin + ']';
      errorString += ' ' + error.message.replace("\n",'');

      if(error.fileName)
          errorString += ' in ' + error.fileName;
      if(error.lineNumber)
          errorString += ' on line ' + error.lineNumber;

      console.error(errorString);
  }

/* ## Sass
================================================== */

  gulp.task('sass', function (){
      return gulp.src(paths.styles.files)
      .pipe(sass({minify:true}))
      .on('error', function(err){
          displayError(err);
      })
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(livereload());
  });

/* ## Image min
================================================== */

  gulp.task('imagemin', function () {
      return gulp.src(paths.assets.files)
          .pipe(imagemin({
              progressive: true,
              svgoPlugins: [{removeViewBox: false}],
              use: [pngquant()]
          }))
          .pipe(gulp.dest(paths.assets.dest));
  });

/* ## concat
================================================== */

  gulp.task('concat', function() {
    return gulp.src(paths.jsconcat.files)
      .pipe(concat(paths.jsconcat.filename))
      .pipe(gulp.dest(paths.jsconcat.dest));
  });


/* ## js minifier
================================================== */

  gulp.task('js-minify', function () {
      return gulp.src(paths.jsminifier.files)
          .pipe(jsmin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(paths.jsminifier.dest));
  });

/* ## Watch
================================================== */

  gulp.task('watch', function() {
    livereload({ start: true });
    livereload.listen();
    gulp.watch([paths.styles.watch], ['sass']);
    gulp.watch(paths.files.watch, ['files']);
    gulp.watch([paths.assets.watch], ['imagemin', 'files']);
    gulp.watch([paths.jsminifier.watch], ['build-js']);
  });

/* ## files
================================================== */

  gulp.task('files', function(cb){
      gulp.src('./src/index.html')
      .pipe(gulp.dest('./public/'));

      gulp.src('./src/assets/font/*')
      .pipe(gulp.dest('./public/assets/font'));

      gulp.src('./src/datas/association.js')
      .pipe(gulp.dest('./public/datas/'));

      gulp.src('./src/scripts/app.js')
      .pipe(gulp.dest('./public/scripts/'))
      .pipe(livereload());

      cb();
  });

/* ## Run sequences
================================================== */

  gulp.task('build-js', function(cb) {
    runSequence('js-minify', 'concat', cb);
  });

  gulp.task('build-prod', function(cb) {
    runSequence('clean:all', ['js-minify', 'imagemin'], 'files', 'sass', 'concat', cb);
  });

/* ## Options
================================================== */
  gulp.task('default', ['watch', 'files', 'serve', 'open']);
  gulp.task('clean', ['clean:all']);
  gulp.task('production', ['build-prod']);

