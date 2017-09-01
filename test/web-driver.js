/**
 * Tests around the webd-driver module
 *
 * @author Julien Roche
 * @version 0.4.0
 * @since 0.0.1
 */

describe('web-driver module tests - ', function () {
    'use strict';

    var chai = require('chai'),
        nock = require('nock'),
        webDriverWrapper = require('./../gulp-angular-protractor/web-driver');

    it('should exports', function () {
        chai.expect(webDriverWrapper).to.exist();
    });
});
