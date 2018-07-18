/**
 * Stream representation to include the process (override of the gulp protractor plugin)
 *
 * @author Julien Roche
 * @version 0.4.0
 * @since 0.0.1
 */

'use strict';

// Imports
const es = require('event-stream');
const path = require('path');
const log = require('fancy-log');
const PluginError = require('plugin-error');

// Constants
const PLUGIN_NAME = require('./constants.json').PLUGIN_NAME;

module.exports = function (options, webDriverUrl, autoStartServer, webDriver) {
    let files = [];
    let args = options.args ? options.args.slice(0) : [];
    let verbose = options.verbose !== false;

    if (options.debug) {
        args.push('debug');
    }

    return es.through(
        function (file) {
            files.push(file.path);
        },
        function () {
            // Attach Files, if any
            if (files.length) {
                args.push('--specs');
                args.push(files.join(','));
            }

            // Pass in the config file
            let configFilePath = path.resolve(path.join(process.cwd(), options.configFile));
            log(PLUGIN_NAME + ' - We have the config file to the following path: ' + configFilePath);
            args.unshift(configFilePath);

            function finalize(ctx, code) {
                if (code) {
                    ctx.emit('error', new PluginError(PLUGIN_NAME, 'protractor exited with code ' + code));
                } else {
                    ctx.emit('end');
                }
            }

            // Start the Web Driver server
            try {
                if (autoStartServer) {
                    let stopServer;
                    let callback = () => {
                        log(PLUGIN_NAME + ' - We will run the Protractor engine');

                        webDriver
                            .runProtractorAndWait(args, (code) => {
                                log(PLUGIN_NAME + ' - We will stop the Protractor engine');

                                if (this) {
                                    try {
                                        stopServer();
                                        finalize(this, code);
                                    } catch (err) {
                                        this.emit('error', new PluginError(PLUGIN_NAME, err));
                                    }
                                }
                            });
                    };
                    // Start the update (maybe), run the server, run protractor and stop the server
                    if (options.webDriverUpdate && options.webDriverUpdate.skip) {
                        stopServer = webDriver.webDriverStandaloneStart(callback, verbose, options.webDriverStart);
                    } else {
                        webDriver
                            .webDriverUpdateAndStart(callback, verbose, options.webDriverUpdate, options.webDriverStart)
                            .then(function (stopServerHandler) {
                                stopServer = stopServerHandler;
                            });
                    }
                } else {
                    // Just run protractor
                    webDriver.runProtractorAndWait(args, (code) => {
                        if (this) finalize(this, code);
                    });
                }

            } catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, err));
            }
        });
};
