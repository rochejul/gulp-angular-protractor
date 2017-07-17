# gulp-angular-protractor
[![Build Status](https://travis-ci.org/rochejul/gulp-angular-protractor.svg?branch=master)](https://travis-ci.org/rochejul/gulp-angular-protractor)[![Dependency Status](https://david-dm.org/rochejul/gulp-angular-protractor.svg)](https://david-dm.org/rochejul/gulp-angular-protractor)
[![devDependency Status](https://david-dm.org/rochejul/gulp-angular-protractor/dev-status.svg)](https://david-dm.org/rochejul/gulp-angular-protractor#info=devDependencies)

[![Known Vulnerabilities](https://snyk.io/test/github/rochejul/gulp-angular-protractor/badge.svg)](https://snyk.io/test/github/rochejul/gulp-angular-protractor)

[![NPM](https://nodei.co/npm/gulp-angular-protractor.png?downloads=true&downloadRank=true)](https://nodei.co/npm/gulp-angular-protractor/)
[![NPM](https://nodei.co/npm-dl/gulp-angular-protractor.png?&months=6&height=3)](https://nodei.co/npm/gulp-angular-protractor/)

> Gulp plugin to run protractor tests with automatic launch and stop of the WebDriver server


## Install

```sh
$ npm install --save-dev gulp-angular-protractor
```


## Side dependencies

You should declare what expected version of protractor and webdriver manager you want to use:

```json
{
  "name": "example-gulp-protractor",
  "version": "0.0.1",
  "description": "",
  "scripts": {
    "gulp": "node node_modules/gulp/bin/gulp.js",
    "test": "npm run gulp protractor"
  },
  "devDependencies": {
    "gulp": "latest",
    "gulp-angular-protractor": "latest",
    "protractor": "4.0.11",
    "webdriver-manager": "10.2.8"
  }
}
```


Be carefull: some protractor and webdriver dependencies version required:
- Some specific node version
- Some specific npm version
- Some specific browser version
- ...

## Usage

```js
var gulp = require('gulp');
var angularProtractor = require('gulp-angular-protractor');

gulp.src(['./src/tests/*.js'])
	.pipe(angularProtractor({
		'configFile': 'test/protractor.config.js',
		'args': ['--baseUrl', 'http://127.0.0.1:8000'],
		'autoStartStopServer': true,
		'debug': true
	}))
	.on('error', function(e) { throw e })
```

## Full example
```js
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
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', callback);
});
```


## API

### angularProtractor(options)

#### options

#### options.autoStartStopServer
Type: `Boolean`
Default: `true`

If true, the plugin will update the WebDriver, launch the WebDriver server before launching tests and stop it at the end automatically

#### options.configFile
Type: `String`
Default: `null`

The path to your protractor config

#### options.args
Type: `Array`
Default: `[]`

Arguments get passed directly to the protractor call [Read the docs for more information](https://github.com/angular/protractor/blob/master/docs/getting-started.md#setup-and-config)

#### options.debug
Type: `Boolean`
Default: `false`

Enables Protractor's [debug mode](https://github.com/angular/protractor/blob/master/docs/debugging.md), which can be used to pause tests during execution and to view stack traces.

#### options.verbose
Type: `Boolean`
Default: `true`

#### options.protractorModulePath
Type: `String`
Default: `undefined`

If you want to use another protractor version instead the default one

### options.webDriverUpdate
Type: `Object`
Default: `undefined`

### options.webDriverUpdate.skip
Type: `Boolean`
Default: `false`

### options.webDriverUpdate.browsers
Type: `Array`
Default: `['chrome']`

List of browsers to update the webdriver

### options.webDriverUpdate.args
Type: `Array`
Default: `[]`

Additional arguments to pass for the update of the webdriver

### options.webDriverStart
Type: `Object`
Default: `undefined`

### options.webDriverStart.args
Type: `Array`
Default: `[]`

Additional arguments to pass for the start of the webdriver


## License

MIT © [Julien Roche](https://github.com/rochejul)
