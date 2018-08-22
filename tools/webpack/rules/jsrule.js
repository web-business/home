import getEnv from './env';

var isDev = getEnv() === 'development';

export default [{
    test: /\.jsx?$/,
    loader: 'babel-loader',
    options: {
        cacheDirectory: isDev,
        babelrc: false,
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: pkg.browserslist,
                    forceAllTransforms: !isDev,
                    modules: false,
                    useBuiltIns: false,
                    debug: false
                }
            ], [
                '@babel/preset-react', 
                { 
                    development: isDev 
                }
            ], [

            ]
        ],
        plugins: [
            ...(isDev ? [] : ['@babel/transform-react-varant-elements']),
            ...(isDev ? [] : ['@babel/transform-react-inline-elements']),
            ...(isDev ? [] : ['transform-react-remove-prop-types']),
        ]
    }
}];
