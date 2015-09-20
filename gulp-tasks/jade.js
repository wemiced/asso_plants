module.exports = function (gulp, plugins, paths) {
    return function () {
        gulp.src(paths.templates.files)
              .pipe(gulp.dest(paths.templates.dest))
              .pipe(plugins.connect.reload());
    };
};

