/* ## Dependencies
================================================== */

  var gulp          = require('gulp');
  var sass          = require('gulp-sass');
  var livereload    = require('gulp-livereload');
  var svgmin        = require('gulp-svgmin');
  var runSequence   = require('gulp-run-sequence');

/* ## Paths
================================================== */

  var paths = {

      styles: {
          src: './src',
          files:  './src/styles/*.scss',
          dest: './public/'
      }

  }

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
      .pipe(sass())
      .on('error', function(err){
          displayError(err);
      })
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(livereload());
  });

/* ## SVG Minify
================================================== */

  gulp.task('svgmin', function() {
    return gulp.src('./src/assets/*.svg')
        .pipe(svgmin({
            plugins: [{
                removeDoctype: false
            }, {
                removeComments: false
            }]
        }))
        .pipe(gulp.dest('./public/assets/'));
  });


  gulp.task('livereload', function() {
    return  gulp.src('').pipe(livereload());
  });


/* ## Watch
================================================== */

  gulp.task('watch', function() {
    livereload({ start: true });
    livereload.listen();
    gulp.watch(['./src/styles/**/*.scss'], ['sass']);
  });

/* ## Run sequences
================================================== */

  gulp.task('build-dev', function(cb) {
    runSequence('sass', cb);
  });

  gulp.task('build-prod', function(cb) {
    runSequence(['sass', 'svgmin'], cb);
  });

/* ## Options
================================================== */

  gulp.task('default', ['watch']);
  gulp.task('dev'), ['build-dev'];
  gulp.task('production', ['build-prod']);

