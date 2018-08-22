// import webpack from 'webpack';
// import config from './webpack/client.config';

var webpack = require('webpack');
var config = require('./webpack/client.config.js');



webpack(config).run(function () {
    console.log('----------')
})