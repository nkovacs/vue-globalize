var path = require('path');

module.exports = {
    entry: './main.js',
    output: {
        path: './build',
        publicPath: 'build/',
        filename: 'build.js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'html' },
            {
                test: /\.js$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    resolveLoader: {
        root: path.join(__dirname, '..', 'node_modules')
    }
};
