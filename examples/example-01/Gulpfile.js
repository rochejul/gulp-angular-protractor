/*jshint node: true, camelcase: false*/
/*global require: true*/

'use strict';

var gulp = require('gulp');

var gprotractor = require('gulp-protractor');

// The protractor task
var gulpProtractorAngular = require('gulp-angular-protractor');
//var protractor = gprotractor.protractor;

// Start a standalone server
var webdriver_standalone = gprotractor.webdriver_standalone;

// Download and update the selenium driver
var webdriver_update = gprotractor.webdriver_update;

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);


// Setting up the test task
gulp.task('protractor', ['webdriver_update'], function(cb) {
    gulp
        .src(['example_spec.js'])
        .pipe(gulpProtractorAngular({
            'configFile': 'protractor.conf.js',
            'debug': false,
            'autoStartStopServer': false
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', cb);
});
