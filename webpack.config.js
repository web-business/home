module.exports = {
    entry: __dirname + '/src/server.js',
    output: {
        path: __dirname + '/server',
        filename: '[name].js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader']
            }
        ]
    },
    target: 'node',    
};