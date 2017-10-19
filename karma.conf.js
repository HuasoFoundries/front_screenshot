module.exports = function (config) {

	var files = [
		'test/vendor/object-assign-polyfill.js',
		'test/vendor/prototype-bind-polyfill.js',
		'test/vendor/string-fromcodepoint-polyfill.js',
		'test/vendor/bluebird.js',
		'test/vendor/jquery.js',
		'dist/ig_screenshot.js',
		'test/ig_screenshot/setup/*.js',
		'test/ig_screenshot/*.js'
	];

	if (process.env.MINIFIED) {
		files = [
			'test/vendor/object-assign-polyfill.js',
			'test/vendor/prototype-bind-polyfill.js',
			'test/vendor/string-fromcodepoint-polyfill.js',
			'test/vendor/bluebird.js',
			'test/vendor/jquery.js',
			'dist/ig_screenshot.min.js',
			'test/ig_screenshot/setup/*.js',
			'test/ig_screenshot/*.js'
		];

	}

	config.set({
		basePath: '',
		frameworks: ['qunit'],

		reporters: ['mocha'],

		port: 9877,
		colors: true,
		logLevel: 'INFO',
		autoWatch: false,
		singleRun: true,
		browsers: ['PhantomJS'],
		proxies: {
			'/dist/': '/base/dist/',
			'/jspm_packages/': '/base/jspm_packages/',
			'/test/': '/base/test/'
		},
		files: files

	});

};
