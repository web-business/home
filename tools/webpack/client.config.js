import path from 'path';
import webpack from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import common from './common.config';

var path = require('path');
var common = require('./common.config');

var config = {
    ...common('web'),
    entry: {
        client: ['@babel/polyfill', './src/client.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../build')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BROWSER': true,
            __DEV__: isDebug
        }),
        new WebpackAssetsManifest({
            output: `${BUILD_DIR}/asset-manifest.json`,
            publicPath: true,
            write
        })
    ]
};


export default config;