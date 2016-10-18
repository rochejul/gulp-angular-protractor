/*jshint node: true, camelcase: false*/
/*global require: true, module: true*/

/**
 * Stream representation to include the process (override of the gulp protractor plugin)
 *
 * TODO: try to enhance that with a real override
 *
 * @author Julien Roche
 * @version 0.0.6
 * @since 0.0.1
 */

'use strict';

var
    // Import gulp plugins
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,

    // Import required API
    es = require('event-stream'),
    path = require('path'),

    // Import internal API
    webDriver = require('./web-driver'),

    // Constants
    PLUGIN_NAME = require('./constants.json').PLUGIN_NAME;

module.exports = function (options, webDriverUrl, autoStartServer) {
    var files = [],
        args = options.args ? options.args.slice(0) : [ ],
        verbose = options.verbose !== false;

    if (options.debug) {
        args.push('debug');
    }

    return es.through(
        function(file) {
            files.push(file.path);
        },
        function() {
            var self = this;

            // Attach Files, if any
            if (files.length) {
                args.push('--specs');
                args.push(files.join(','));
            }

            // Pass in the config file
            var configFilePath = path.resolve(path.join(process.cwd(), options.configFile));
            gutil.log(PLUGIN_NAME + ' - We have the config file to the following path: ' + configFilePath);
            args.unshift(configFilePath);

            // Start the Web Driver server
            try {
                if (autoStartServer) {
                    // Start the update, run the server, run protractor and stop the server
                    webDriver.webDriverUpdateAndStart(function () {
                        gutil.log(PLUGIN_NAME + ' - We will run the Protractor engine');

                        webDriver
                            .runProtractorAndWait(args, function(code) {
                                if (self) {
                                    try {
                                        webDriver.webDriverStandaloneStop(webDriverUrl, function () {
                                            if (code) {
                                                self.emit('error', new PluginError(PLUGIN_NAME, 'protractor exited with code ' + code));

                                            } else {
                                                self.emit('end');
                                            }
                                        });

                                    } catch (err) {
                                        self.emit('error', new PluginError(PLUGIN_NAME, err));
                                    }
                                }
                            });
                    }, verbose, options.webDriverUpdate, options.webDriverStart);

                } else {
                    // Just run protractor
                    webDriver.runProtractorAndWait(args, function (code) {
                        if (self) {
                            if (code) {
                                self.emit('error', new PluginError(PLUGIN_NAME, 'protractor exited with code ' + code));

                            } else {
                                self.emit('end');
                            }
                        }
                    });
                }

            } catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, err));
            }
        });
};
