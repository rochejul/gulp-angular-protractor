/**
 * Expose the gulp-angular-protractor plugin
 *
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

const
    // Import gulp plugins
    gutil = require('gulp-util'),

    // Import required API
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),

    // Import internal API
    webDriverFactory = require('./gulp-angular-protractor/web-driver'),
    gulpStream = require('./gulp-angular-protractor/gulp-stream'),
    defaultOptions = require('./gulp-angular-protractor/default-options.json'),

    // Constants
    PLUGIN_NAME = require('./gulp-angular-protractor/constants.json').PLUGIN_NAME;

module.exports = function (options) {
    gutil.log(PLUGIN_NAME + ' - The plugin is retrieved and will start soon');

    let mergedOptions = _.extend({ }, defaultOptions, options);
    let webDriver = webDriverFactory(mergedOptions.protractorModulePath);

    var
        protractorConfiguration,
        webDriverUrl = webDriver.DEFAULT_WEB_DRIVER_URL;

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
            webDriverUrl = protractorConfiguration.config.seleniumAddress;
        }

        gutil.log(PLUGIN_NAME + ' - The selenium address is: ' + protractorConfiguration.config.seleniumAddress);
        gutil.log(PLUGIN_NAME + ' - The selenium address used is: ' + webDriverUrl);

        return gulpStream(mergedOptions, webDriverUrl, true, webDriver);

    } else {
        gutil.log(PLUGIN_NAME + ' - Basic use (as the gulp-protractor plugin).');
        return gulpStream(mergedOptions, webDriverUrl, false, webDriver);
    }
};
