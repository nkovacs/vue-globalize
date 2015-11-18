var webpack = require('webpack');
var pack = require('./package.json');

var banner =
  pack.name + ' v' + pack.version + '\n' +
  '(c) ' + new Date().getFullYear() +
  ' ' + pack.author.name + '\n' +
  'Released under the ' + pack.license + ' License.';

module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: pack.name + '.js',
        library: pack.name,
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            // fix globalize
            { test: /globalize/, loader: 'imports?define=>false' }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
