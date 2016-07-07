/*jshint node: true*/
/*global exports: true, jasmine: true*/

'use strict';

var fs = require('fs');
var path = require('path');

var reporters = require('jasmine-reporters');

// An example configuration file.
// https://raw.github.com/angular/protractor/master/example/conf.js
exports.config = {
    // The address of a running selenium server.
    'seleniumAddress': 'http://localhost:4444/wd/hub',
    // Capabilities to be passed to the webdriver instance.
    'capabilities': {
        'browserName': 'chrome'
    },

    // Options to be passed to Jasmine-node.
    'jasmineNodeOpts': {
        'showColors': true,
        'defaultTimeoutInterval': 30000
    },

    // A callback function called once protractor is ready and available, and
    // before the specs are executed
    // You can specify a file containing code to run by setting onPrepare to
    // the filename string.
    'onPrepare': function () {
        !fs.existsSync(__dirname + '/target') &&  fs.mkdirSync(__dirname + '/target');
        !fs.existsSync(__dirname + '/target/e2e') &&  fs.mkdirSync(__dirname + '/target/e2e');
        
        var reporterPath = path.resolve(path.join(__dirname, '/target/e2e'));
        console.info('The JUnit report will be generated into the following path:', reporterPath);
        
        jasmine
            .getEnv()
            .addReporter(new reporters.JUnitXmlReporter({
                'savePath': reporterPath,
                'consolidate': true,
                'consolidateAll': true
            }));
    }
};