module.exports = function (gulp, plugins, paths) {
	plugins.nodemon({
	    script: 'server.js'
	  , ext: 'js html css'
	  , env: { 'NODE_ENV': 'development' }
	});
	gulp.src('').pipe(plugins.open({uri: 'http://localhost:' + 5000}));

};