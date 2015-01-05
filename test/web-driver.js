/*jshint node: true*/
/*global require: true, describe: true, it: true*/

/**
 * Tests around the webd-driver module
 *
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

describe('web-driver module tests - ', function () {
	'use strict';

	var chai = require('chai'),
		nock = require('nock'),
		webDriver = require('./../gulp-angular-protractor/web-driver');

	it('should exports', function () {
		chai.expect(webDriver).to.exist();
	});

	describe('"getWebDriverShutdownUrl" should ', function () {
		it('exists', function () {
			chai.expect(webDriver.getWebDriverShutdownUrl).to.exist();
		});

		it('return null if no url is specified', function () {
			chai.expect(webDriver.getWebDriverShutdownUrl()).to.be.null();
		});

		it('return the WebDriver shutdown url', function () {
			chai.expect(webDriver.getWebDriverShutdownUrl('http://localhost:4444/wd/hub')).to.equal('http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer');
		});

		it('return null if the string is not a well formed url', function () {
			chai.expect(webDriver.getWebDriverShutdownUrl('anotwellformedurl')).to.be.null();
		});
	});

	describe('"webDriverStandaloneStop" should make an HTTP to shutdown the WebDriver server ', function () {
		it('when the URL is correct', function (asyncCallback) {
			var mock = nock('http://localhost:4444')
				.get('/selenium-server/driver/?cmd=shutDownSeleniumServer')
				.reply(200, 'All is fine');

			webDriver.webDriverStandaloneStop('http://localhost:4444/wd/hub', function (err) {
				chai.expect(mock.isDone()).to.be.ok();
				chai.expect(err).to.not.exist();
				asyncCallback();
			});
		});

		it('except if the URL is incorrect', function (asyncCallback) {
			var mock = nock('http://localhost:4444')
				.get('/selenium-server/driver/?cmd=shutDownSeleniumServer')
				.reply(200, 'All is fine');

			webDriver.webDriverStandaloneStop('http://localhost:4443/wd/hub', function (err) {
				chai.expect(mock.isDone()).to.not.be.ok();
				chai.expect(err).to.exist();
				asyncCallback();
			});
		});
	});
});