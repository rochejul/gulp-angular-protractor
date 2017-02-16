/**
 * Utility module to manage the WebDriver
 *
 * @author Julien Roche
 * @version 0.4.0
 * @since 0.2.0
 */

'use strict';

// Imports
const path = require('path');

// Constants & variables
let protractorDir = null; // caching

class ProtractorUtils {
    /**
     * @method
     * @static
     * @returns {string}
     */
    static getProtractorDir() {
        if (protractorDir) {
            return protractorDir;
        }

        let result = require.resolve('protractor');

        if (result) {
            protractorDir = path.resolve(path.join(path.dirname(result), '..', '..', '.bin'));
            return protractorDir;
        }

        throw new Error('No protractor installation found.');
    }
}

module.exports = ProtractorUtils;
