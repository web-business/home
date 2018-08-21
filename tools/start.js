import path from 'path';
import express from 'express';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';

var server;
var isDebug = !process.argv.includes('--release');

var watchOptions = {
    poll: true,
    ignored: /node_modules/,
};

function createCompilationPromise(name, compiler, config) {
    return new Promise((resolve, reject) => {
        let timeStart = new Date();
        compiler.hooks.compile.tap(name, () => {
            timeStart = new Date();
            console.info(`[${format(timeStart)}] Compiling '${name}'...`);
        });

        compiler.hooks.done.tap(name, stats => {
            console.info(stats.toString(config.stats));
            const timeEnd = new Date();
            const time = timeEnd.getTime() - timeStart.getTime();
            if (stats.hasErrors()) {
                console.info(
                    `[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`,
                );
                reject(new Error('Compilation failed!'));
            } else {
                console.info(
                    `[${format(
                        timeEnd,
                    )}] Finished '${name}' compilation after ${time} ms`,
                );
                resolve(stats);
            }
        });
    });
}

async function start() {
    if (server) {
        return server;
    }

    server = express();
    server.use(express.static(path.resolve(__dirname, '../public')));

    var clientConfig = webpackConfig;

    clientConfig.entry.client.push('./tools/lib/webpackHotDevClient');
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    clientConfig.module.rules = clientConfig.module.rules.filter(
        x => x.loader !== 'null-loader'
    );

    var serverConfig = webpackConfig.find(config => config.name === 'server');

    serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
    serverConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js';
    serverConfig.module.rules = serverConfig.module.rules.filter(
        x => x.loader !== 'null-loader',
    );

    serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

    // await run(clean);

    var multiCompiler = webpack(webpackConfig);

    var clientCompiler = multiCompiler.compilers.find(
        compiler => compiler.name === 'client',
    );

    var serverCompiler = multiCompiler.compilers.find(
        compiler => compiler.name === 'server',
    );

    var clientPromise = createCompilationPromise(
        'client',
        clientCompiler,
        clientConfig,
    );

    var serverPromise = createCompilationPromise(
        'server',
        serverCompiler,
        serverConfig,
    );

    server.use(
        webpackDevMiddleware(clientCompiler, {
            publicPath: clientConfig.output.publicPath,
            logLevel: 'silent',
            watchOptions,
        })
    );

    server.use(webpackHotMiddleware(clientCompiler, { log: false }));

    let app;
    let appPromise;
    let appPromiseResolve;
    let appPromiseIsResolved = true;

    serverCompiler.hooks.compile.tap('server', () => {
        if (!appPromiseIsResolved) {
            return;
        }

        appPromiseIsResolved = false;
        // eslint-disable-next-line no-return-assign
        appPromise = new Promise(resolve => (appPromiseResolve = resolve));
    });

    server.use((req, res) => {
        appPromise
            .then(() => app.handle(req, res))
            .catch(error => console.error(error));
    });

    function checkForUpdate(fromUpdate) {
        const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
        if (!app.hot) {
            throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
        }
        if (app.hot.status() !== 'idle') {
            return Promise.resolve();
        }
        return app.hot
            .check(true)
            .then(updatedModules => {
                if (!updatedModules) {
                    if (fromUpdate) {
                        console.info(`${hmrPrefix}Update applied.`);
                    }
                    return;
                }
                if (updatedModules.length === 0) {
                    console.info(`${hmrPrefix}Nothing hot updated.`);
                } else {
                    console.info(`${hmrPrefix}Updated modules:`);
                    updatedModules.forEach(moduleId =>
                        console.info(`${hmrPrefix} - ${moduleId}`),
                    );
                    checkForUpdate(true);
                }
            })
            .catch(error => {
                if (['abort', 'fail'].includes(app.hot.status())) {
                    console.warn(`${hmrPrefix}Cannot apply update.`);
                    delete require.cache[require.resolve('../build/server')];
                    // eslint-disable-next-line global-require, import/no-unresolved
                    app = require('../build/server').default;
                    console.warn(`${hmrPrefix}App has been reloaded.`);
                } else {
                    console.warn(
                        `${hmrPrefix}Update failed: ${error.stack || error.message}`,
                    );
                }
            });
    }


    serverCompiler.watch(watchOptions, (error, stats) => {
        if (app && !error && !stats.hasErrors()) {
            checkForUpdate().then(() => {
                appPromiseIsResolved = true;
                appPromiseResolve();
            });
        }
    });

    await clientPromise;
    await serverPromise;

    var timeStart = new Date();
    console.info(`[${format(timeStart)}] Launching server...`);

    // Load compiled src/server.js as a middleware
    // eslint-disable-next-line global-require, import/no-unresolved
    app = require('../build/server').default;
    appPromiseIsResolved = true;
    appPromiseResolve();

    // Launch the development server with Browsersync and HMR
    await new Promise((resolve, reject) =>
        browserSync.create().init(
            {
                // https://www.browsersync.io/docs/options
                server: 'src/server.js',
                middleware: [server],
                open: !process.argv.includes('--silent'),
                ...(isDebug ? {} : { notify: false, ui: false }),
            },
            (error, bs) => (error ? reject(error) : resolve(bs)),
        ),
    );

    var timeEnd = new Date();
    var time = timeEnd.getTime() - timeStart.getTime();

    console.info(`[${format(timeEnd)}] Server launched after ${time} ms`);
    return server;
}

export default start;