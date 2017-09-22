module.exports = function (grunt) {

    grunt.config('karma', {
        options: {
            basePath: '',
            frameworks: ['qunit'],

            reporters: ['progress'],

            port: 9877,
            colors: true,
            logLevel: 'INFO',
            autoWatch: false,
            browsers: ['PhantomJS'],
            singleRun: true

        },

        ig_screenshot: {
            options: {

                // list of files / patterns to load in the browser
                files: [
                    'test/vendor/object-assign-polyfill.js',
                    'test/vendor/prototype-bind-polyfill.js',
                    'test/vendor/bluebird.js',
                    'test/vendor/jquery.js',
                    'dist/ig_screenshot.bundle.js',
                    'test/ig_screenshot/setup/*.js',
                    'test/ig_screenshot/*.js'
                ]

            }
        },
        ig_screenshot_min: {
            options: {

                // list of files / patterns to load in the browser
                files: [
                    'test/vendor/object-assign-polyfill.js',
                    'test/vendor/prototype-bind-polyfill.js',
                    'test/vendor/bluebird.js',
                    'test/vendor/jquery.js',
                    'dist/ig_screenshot.min.js',
                    'test/ig_screenshot/setup/*.js',
                    'test/ig_screenshot/*.js'
                ]

            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');

};
