# gulp-angular-protractor [![Build Status](https://travis-ci.org/rochejul/gulp-angular-protractor.svg?branch=master)](https://travis-ci.org/rochejul/gulp-angular-protractor)

> Gulp plugin to run protractor tests with automatic launch and stop of the WebDriver server


## Install

```sh
$ npm install --save-dev gulp-angular-protractor
```


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


## License

MIT © [Julien Roche](https://github.com/rochejul)
