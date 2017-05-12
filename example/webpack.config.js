var path = require('path');

module.exports = {
    context: __dirname,
    entry: './main.js',
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'build/',
        filename: 'build.js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'html' },
            {
                test: /\.js$/,
                exclude: /(node_modules|build)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};
