/*jshint node: true, camelcase: false*/
/*global require: true, module: true*/

/**
 * Stream representation to include the process (override of the gulp protractor plugin)
 *
 * TODO: try to enhance that with a real override
 *
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

var
    // Import gulp plugins
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,

    // Import required API
    es = require('event-stream'),

    // Import internal API
    webDriver = require('./web-driver'),

    // Constants
    PLUGIN_NAME = require('./constants.json').PLUGIN_NAME;

module.exports = function (options, webDriverUrl) {
    var files = [],
        args = options.args || [ ];

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
            args.unshift(options.configFile);

            // Start the Web Driver server
            try {
                webDriver.webDriverUpdateAndStart(function () {
                    gutil.log(PLUGIN_NAME + ' - We will run the Protractor engine');

                    var child = webDriver
                        .runProtractor(args)
                        .on('exit', function(code) {
                            if (child) {
                                child.kill();
                            }

                            if (self) {
                                if (code) {
                                    self.emit('error', new PluginError(PLUGIN_NAME, 'protractor exited with code ' + code));

                                } else {
                                    try {
                                        webDriver.webDriverStandaloneStop(webDriverUrl, function () {
                                            self.emit('end');
                                        });

                                    } catch (err) {
                                        self.emit('error', new PluginError(PLUGIN_NAME, err));
                                    }
                                }
                            }
                        });
                });

            } catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, err));
            }
        });
};
