
var isDevelopment = !process.argv.includes('--release');
var isVerbose = process.argv.includes('--verbose');



export default function (target) {
    return {
        mode: isDevelopment ? 'development' : 'production',
        target,
        output: {
            path: resolvePath(BUILD_DIR, 'public/assets'),
            publicPath: '/assets/',
            pathinfo: isVerbose,
            filename: isDevelopment ? '[name].js' : '[name].[chunkhash:8].js',
            chunkFilename: isDevelopment ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
            devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        },
        bail: !isDevelopment,
        cache: isDevelopment,
        stats: {
            cached: isVerbose,
            cachedAssets: isVerbose,
            chunks: isVerbose,
            chunkModules: isVerbose,
            colors: true,
            hash: isVerbose,
            modules: isVerbose,
            reasons: isDevelopment,
            timings: true,
            version: isVerbose,
        },
        devtool: isDevelopment ? 'cheap-module-inline-source-map' : 'source-map',
        resolve: {
            modules: ['node_modules', 'src']
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: isDevelopment,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: pkg.browserslist,
                                    forceAllTransforms: !isDevelopment,
                                    modules: false,
                                    useBuiltIns: false,
                                    debug: false
                                }
                            ], [
                                '@babel/preset-react', 
                                { 
                                    development: isDevelopment 
                                }
                            ], [

                            ]
                        ]
                    }
                }
            ],
            strictExportPresence: true
        }
    }
};