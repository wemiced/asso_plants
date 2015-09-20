module.exports = function (gulp, plugins, paths) {
    return function () {
        gulp.src(paths.templates.files)
              .pipe(plugins.plumber())
              .pipe(gulp.dest(paths.templates.dest));
    };
};

