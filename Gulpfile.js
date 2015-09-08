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


/* ## Paths
================================================== */

  var paths = {

      styles: {
          src: './src',
          files:  './src/styles/*.scss',
          dest: './public/styles/',
          watch: './src/styles/**/*.scss'
      },
      jsminifier: {
          files: './src/vendor/*.js',
          dest: './src/vendor/min/'
      },
      jsconcat : {
        files: './src/vendor/min/*.js',
        filename: 'vendor.min.js',
        dest: './public/vendor/'
      },
      svgmin : {
        file: './src/assets/svg/*.svg',
        dest: './public/assets/svg/'
      }
  }

/* ## clean
================================================== */

  gulp.task('clean', function () {
    return del(['public/**'] );
  });


/* ## serve
================================================== */

gulp.task('serve', function() {

    connect.server({
        port:8000,
        root: './public'
    });

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

/* ## SVG Minify
================================================== */

  gulp.task('svgmin', function() {
    return gulp.src(paths.svgmin.file)
        .pipe(svgmin({
            plugins: [{
                removeDoctype: false
            }, {
                removeComments: false
            }]
        }))
        .pipe(gulp.dest(paths.svgmin.dest))
        .pipe(livereload());
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
    gulp.watch(['./src/assets/fonts/*', './src/index.html', './src/datas/association.js', './src/assets/png/*', './src/scripts/app.js'], ['files']);
    gulp.watch(['./src/assets/svg/*.svg'], ['svgmin']);
    gulp.watch(['./src/vendor/*.js'], ['build-js']);

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
      .pipe(gulp.dest('./public/scripts/'));

      gulp.src('./src/assets/png/*.png')
      .pipe(gulp.dest('./public/assets/png'))
      .pipe(livereload());
      cb();
  });

/* ## Run sequences
================================================== */

  gulp.task('build-js', function(cb) {
    runSequence('js-minify', 'concat', cb);
  });

  gulp.task('build-dev', function(cb) {
    runSequence(['clean', 'sass', 'js-minify', 'files'], 'concat', cb);
  });

  gulp.task('build-prod', function(cb) {
    runSequence(['js-minify', 'svgmin', 'files'], 'sass', 'concat', cb);
  });

/* ## Options
================================================== */
  gulp.task('default', ['watch', 'files', 'serve']);
  gulp.task('clean', ['clean']);
  gulp.task('dev'), ['build-dev'];
  gulp.task('production', ['build-prod']);

