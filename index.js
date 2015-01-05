/*jshint node: true*/
/*global require: true, module: true*/

/**
 * Expose the gulp-angular-protractor plugin
 *
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

var
    // Import gulp plugins
    gutil = require('gulp-util'),
    gprotractor = require('gulp-protractor'),

    // Import required API
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),

    // Import internal API
    webDriver = require('./gulp-angular-protractor/web-driver'),
    gulpStream = require('./gulp-angular-protractor/gulp-stream'),
    defaultOptions = require('./gulp-angular-protractor/default-options.json'),

    // Constants
    PLUGIN_NAME = require('./gulp-angular-protractor/constants.json').PLUGIN_NAME;

module.exports = function (options) {
    gutil.log(PLUGIN_NAME + ' - The plugin is retrieved and will start soon');

    var
        protractorConfiguration,
        webDriverShutDownUrl,
        webDriverUrl = webDriver.DEFAULT_WEB_DRIVER_URL,
        mergedOptions = _.extend({ }, defaultOptions, options);

    if (!mergedOptions.configFile) {
        throw new gutil.PluginError(PLUGIN_NAME, '`configFile` required');
    }

    if (!fs.existsSync(mergedOptions.configFile)) {
        throw new gutil.PluginError(PLUGIN_NAME, 'The protractor configuration file specified by `configFile` does not exist');
    }

    if (mergedOptions.autoStartStopServer) {
        gutil.log(PLUGIN_NAME + ' - We will try to start and stop automatically the WebDriver server');

        protractorConfiguration = require(path.resolve(mergedOptions.configFile));

        if (!protractorConfiguration || !protractorConfiguration.config) {
            throw new gutil.PluginError(PLUGIN_NAME, 'No protractor configuration was exported');
        }

        if (protractorConfiguration.config.seleniumAddress) {
            webDriverShutDownUrl = webDriver.getWebDriverShutdownUrl(protractorConfiguration.config.seleniumAddress);

            if (webDriverShutDownUrl) {
                webDriverUrl = protractorConfiguration.config.seleniumAddress;

            } else {
                throw new gutil.PluginError(PLUGIN_NAME, 'The selenium address is not a valid url');
            }
        }

        gutil.log(PLUGIN_NAME + ' - The selenium address is: ' + protractorConfiguration.config.seleniumAddress);
        gutil.log(PLUGIN_NAME + ' - The selenium address used is: ' + webDriverUrl);
        gutil.log(PLUGIN_NAME + ' - The selenium shutdown address used is: ' + webDriverShutDownUrl);

        return gulpStream(mergedOptions, webDriverUrl);

    } else {
        gutil.log(PLUGIN_NAME + ' - Basic use (as the gulp-protractor plugin).');
        return gprotractor.protractor(mergedOptions);
    }
};
