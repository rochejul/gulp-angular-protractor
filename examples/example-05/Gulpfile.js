/*jshint node: true, camelcase: false*/
/*global require: true*/

'use strict';

var gulp = require('gulp'),
    gulpProtractorAngular = require('gulp-angular-protractor');

// Setting up the test task
gulp.task('protractor', function(callback) {
    gulp
        .src(['example_spec.js'])
        .pipe(gulpProtractorAngular({
            'configFile': 'protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true,
            'verbose': false,
            'webDriverUpdate': {
                'browsers': ['ie'],
                'args': ['--ie32']
            },
            'webDriverStart': {
                'args': ['--ie32']
            }
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', callback);
});
