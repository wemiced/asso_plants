'use strict';

  var gulp          = require('gulp');
  var watch         = require('gulp-watch');
  var plugins       = require('gulp-load-plugins')();

  var paths = {
      clean: {
        files: './public'
      },
      serve : {
        port: '8000',
        root: './public'
      },
      fonts: {
        files: './src/assets/fonts/**/*',
        dest: './public/assets/fonts/',
        watch: ['./src/assets/fonts/**/*']
      },
      vendor: {
        name: 'vendor.min.js',
        dest: './public/vendor/',
        watch: './bower_components/*'
      },
      templates: {
          files: './src/index.html',
          dest: './public/',
          watch: './src/*.html'
      },
      styles: {
          files:  './src/styles/*.scss',
          dest: './public/styles/',
          watch: './src/styles/**/*.scss'
      },
      ressources: {
        files: './src/ressources/*',
        dest: './public/ressources/',
        watch: './src/ressources/*'
      },
      scripts: {
          files: ['./src/scripts/libs/*.js', './src/scripts/directives/*.js', './src/scripts/app.js', './src/scripts/services/*.js', './src/scripts/controllers/*.js'],
          dest: './public/scripts/',
          name: 'app.min.js',
          watch: './src/scripts/**/*.js'
      },
      assets : {
        files: ['./src/assets/imgs/**/*{png,svg,jpg}'],
        dest: './public/assets/imgs/',
        watch: './src/assets/imgs/**/*',
        clean: './public/assets/imgs/**/*'
      }
  }
  
  var displayError = function(error) {

      var errorString = '[' + error.plugin + ']';
      errorString += ' ' + error.message.replace("\n",''); 

      if(error.fileName)
          errorString += ' in ' + error.fileName;

      if(error.lineNumber)
          errorString += ' on line ' + error.lineNumber;
      console.error(errorString);

  }

  function getTask(task) {
      return require('./gulp-tasks/' + task)(gulp, plugins, paths, displayError);
  }

  gulp.task('clean', getTask('clean'));
  gulp.task('serve', getTask('nodemon'));
  gulp.task('style', getTask('style'));
  gulp.task('assets', getTask('assets'));
  gulp.task('jade', getTask('jade'));
  gulp.task('scripts', getTask('scripts'));
  gulp.task('vendor', getTask('vendor'));
  gulp.task('watch', getTask('watch'));
  gulp.task('test', getTask('test'));
  gulp.task('ressources', getTask('ressources'));


  gulp.task('build-prod', function(cb) {
    plugins.runSequence('clean', 'style', 'jade', 'assets', 'vendor', 'scripts', 'ressources');
  });

  gulp.task('default', ['watch', 'serve']);
  gulp.task('production', ['build-prod']);
