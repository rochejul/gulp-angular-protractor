/*jshint node: true*/
/*global require: true, describe: true, it: true*/

/**
 * Main tests for the gulp plugin
 *
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

describe('gulp-angular-protractor tests - ', function () {
	'use strict';

	var chai = require('chai');
	var angularProtractor = require('./../index');

	describe('instantiation should ', function () {
		it('throw an exception if not options are set', function () {
			chai.expect(angularProtractor.bind(angularProtractor)).to.throw('`configFile` required');
		});

		it('throw an exception if the configFile option is no declared', function () {
			chai.expect(function () {
				angularProtractor({ });
			}).to.throw('`configFile` required');
		});

		it('throw an exception if the configFile option is no set', function () {
			chai.expect(function () {
				angularProtractor({ 'configFile': null });
			}).to.throw('`configFile` required');
		});

		it('throw an exception if the protractor configuration file does not exist', function () {
			chai.expect(function () {
				angularProtractor({ 'configFile': 'protractor.conf.js' });
			}).to.throw('The protractor configuration file specified by `configFile` does not exist');
		});

		describe('with `autoStartStopServer` to true ', function () {
			it('throw an exception if the protractor configuration does not export configuration', function () {
				chai.expect(function () {
					angularProtractor({ 'autoStartStopServer': true, 'configFile': './test/resources/protractor.conf.no.export.js' });
				}).to.throw('No protractor configuration was exported');
			});

			it('throw an exception if the protractor configuration contains an invalid selenium address url', function () {
				chai.expect(function () {
					angularProtractor({ 'autoStartStopServer': true, 'configFile': './test/resources/protractor.conf.invalid.url.js' });
				}).to.throw('The selenium address is not a valid url');
			});

			it('should return the stream object', function () {
				var streamObject = angularProtractor({ 'autoStartStopServer': true, 'configFile': './test/resources/protractor.conf.valid.js' });
				chai.expect(streamObject).to.exist();
				chai.expect(streamObject.end).to.exist();
			});
		});

		describe('with `autoStartStopServer` to false ', function () {
			it('should return the stream object', function () {
				var streamObject = angularProtractor({ 'autoStartStopServer': false, 'configFile': './test/resources/protractor.conf.valid.js' });
				chai.expect(streamObject).to.exist();
				chai.expect(streamObject.end).to.exist();
			});
		});
	});
});