/*jshint node: true, camelcase: false*/
/*global require: true, module: true, process: true*/

/**
 * Utility module to manage the WebDriver
 *
 * @author Julien Roche
 * @version 0.0.6
 * @since 0.0.1
 */

'use strict';

// Imports
var
    // Import gulp plugins
    gutil = require('gulp-util'),

    // Import required API
    url = require('url'),
    http = require('http'),
    childProcess = require('child_process'),

    // Import internals libraries
    protractorUtils = require('./protractor-utils');

// Constants & variables
var
    PLUGIN_NAME = require('./constants.json').PLUGIN_NAME,
    IS_WINDOWS = /^win/.test(process.platform),
    WIN_COMMAND_EXTENSION = IS_WINDOWS ? '.cmd': '',
    COMMAND_RELATIVE_PATH = IS_WINDOWS ? '' : './',

    PROTRACTOR_DIR = protractorUtils.getProtractorDir(),
    PROTRACTOR_COMMAND = 'protractor' + WIN_COMMAND_EXTENSION,

    WEB_DRIVER_LOG_STARTED = 'Started org.openqa.jetty.jetty.Server',
    WEB_DRIVER_LOG_STARTED_NEW = 'Selenium Server is up and running',
    WEB_DRIVER_LOG_STOPPED = 'Command request: shutDownSeleniumServer',
    WEB_DRIVER_SHUTDOWN_PATH = '/selenium-server/driver/?cmd=shutDownSeleniumServer',
    WEB_DRIVER_COMMAND = 'webdriver-manager' + WIN_COMMAND_EXTENSION,
    WEB_DRIVER_START_COMMAND = 'start';

module.exports = {
    /**
     * Default WebDriver URL
     *
     * @constant
     * @static
     */
    'DEFAULT_WEB_DRIVER_URL': 'http://localhost:4444/wd/hub',

    /**
     * Return the WebDriver shutdown url based on the webDriverUrl
     *
     * @method
     * @static
     * @param {string} webDriverUrl
     * @returns {string}
     */
    'getWebDriverShutdownUrl': function (webDriverUrl) {
        if (webDriverUrl) {
            var urlMetaData = url.parse(webDriverUrl);

            if (urlMetaData && urlMetaData.host) {
                return urlMetaData.protocol + '//' + urlMetaData.host + WEB_DRIVER_SHUTDOWN_PATH;
            }
        }

        return null;
    },

    /**
     * Execute the protractor engine
     *
     * @method
     * @static
     * @param {string[]} args
     * @returns {Object}
     */
    'runProtractor': function (args) {
        return childProcess.spawn(COMMAND_RELATIVE_PATH + PROTRACTOR_COMMAND, args, {
            'stdio': 'inherit',
            'env': process.env,
            'cwd': PROTRACTOR_DIR
        });
    },

    /**
     * Execute the protractor engine
     *
     * @method
     * @static
     * @param {string[]} args
     * @param {Function} callback
     */
    'runProtractorAndWait': function (args, callback) {
        var child = this
            .runProtractor(args)
            .on('exit', function(code) {
                if (child) {
                    child.kill();
                }

                if (callback) {
                    callback(code);
                }
            });
    },

    /**
     * Start the WebDriver server
     *
     * @method
     * @static
     * @param {Function} callback
     * @param {boolean} [verbose=true]
     * @param {Object} [startOptions]
     */
    'webDriverStandaloneStart': function (callback, verbose, startOptions) {
        gutil.log(PLUGIN_NAME + ' - Webdriver standalone server will be started');

        function _interceptLogData(data) {
            var dataString = data.toString();

            if (logOutput && verbose) {
                gutil.log(dataString);
            }

            if (dataString.indexOf(WEB_DRIVER_LOG_STARTED_NEW) >= 0 || dataString.indexOf(WEB_DRIVER_LOG_STARTED) >= 0) {
                gutil.log(PLUGIN_NAME + ' - Webdriver standalone server is started');
                callbackWasCalled = true;
                logOutput = false;
                callback();

            } else if (dataString.indexOf(WEB_DRIVER_LOG_STOPPED) >= 0) {
                logOutput = true;

                if (verbose) {
                    gutil.log(dataString);
                }
            }
        }

        var
            callbackWasCalled = false,
            logOutput = true,
            command = childProcess.spawn(
                COMMAND_RELATIVE_PATH + WEB_DRIVER_COMMAND,
                [WEB_DRIVER_START_COMMAND].concat(startOptions && startOptions.args ? startOptions.args : []),
                { 'cwd': PROTRACTOR_DIR }
            );

        command.once('close', function (errorCode) {
            gutil.log(PLUGIN_NAME + ' - Webdriver standalone server will be closed');

            if (!callbackWasCalled) {
                callback(errorCode);
            }
        });

        command.stderr.on('data', _interceptLogData);
        command.stdout.on('data', _interceptLogData);
    },

    /**
     * Stop the WebDriver server
     *
     * @method
     * @static
     * @param {string} webDriverUrl
     * @param {Function} callback
     */
    'webDriverStandaloneStop': function (webDriverUrl, callback) {
        var
            shutDownUrl = this.getWebDriverShutdownUrl(webDriverUrl),
            shutDownUrlMetaData = url.parse(shutDownUrl);

        http
            .get({ 'host': shutDownUrlMetaData.hostname,  'port': shutDownUrlMetaData.port, 'path': shutDownUrlMetaData.path }, function () {
                gutil.log(PLUGIN_NAME + ' - Webdriver standalone server is stopped');
                callback();
            })
            .on('error', function (err) {
                gutil.log(PLUGIN_NAME + ' - An error occured to stop the Webdriver standalone server');
                callback(err);
            });
    },

    /**
     * Update the webDriver connector
     *
     * @method
     * @static
     * @params {{ 'browsers' } | Function} optsOrCallback
     * @param {Function} cb
     */
    'webDriverUpdate': function (optsOrCallback, cb) {
        var callback = (cb ? cb : optsOrCallback);
        var options = (cb ? optsOrCallback : null);
        var args = ['update', '--standalone'];
        var browsers = ['chrome'];

        if (options) {
            if (options.browsers && options.browsers.length > 0) {
                browsers = options.browsers;
            }

            browsers.forEach(function(element) {
                args.push('--' + element);
            });

            if (options.args) {
                args = args.concat(options.args);
            }
        }

        childProcess
            .spawn(
                COMMAND_RELATIVE_PATH + WEB_DRIVER_COMMAND,
                args,
                {
                    'cwd': PROTRACTOR_DIR,
                    'stdio': 'inherit'
                }
            )
            .once('close', callback);
    },

    /**
     * Update and start the webDriver connector
     *
     * @method
     * @static
     * @param {Function} callback
     * @param {boolean} [verbose=true]
     * @param {Object} [updateOptions]
     * @param {Object} [startOptions]
     */
    'webDriverUpdateAndStart': function (callback, verbose, updateOptions, startOptions) {
        var self = this;
        gutil.log(PLUGIN_NAME + ' - Webdriver standalone will be updated');

        this.webDriverUpdate(updateOptions, function () {
            gutil.log(PLUGIN_NAME + ' - Webdriver standalone is updated');
            self.webDriverStandaloneStart(callback, verbose, startOptions);
        });
    }
};
