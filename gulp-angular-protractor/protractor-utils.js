/*jshint node: true, camelcase: false*/
/*global require: true, module: true, process: true*/

/**
 * Utility module to manage the WebDriver
 *
 * @author Julien Roche
 * @version 0.2.0
 * @since 0.2.0
 */

'use strict';

// Imports
var path = require('path');

// Constants & variables
var protractorDir = null; // caching

module.exports = {
    /**
     * @method
     * @static
     * @returns {string}
     */
    'getProtractorDir': function () {
        if (protractorDir) {
            return protractorDir;
        }
        
        var result = require.resolve('protractor');
        
        if (result) {
            protractorDir = path.resolve(path.join(path.dirname(result), '..', '..', '.bin'));
            return protractorDir;
        }

        throw new Error('No protractor installation found.');
    }
};
