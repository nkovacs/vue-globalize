var webpack = require('webpack');
var path = require('path');
var pack = require('./package.json');

var banner =
  pack.name + ' v' + pack.version + '\n' +
  '(c) ' + new Date().getFullYear() +
  ' ' + pack.author.name + '\n' +
  'Released under the ' + pack.license + ' License.';

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: pack.name + '.js',
        library: pack.name,
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            // fix globalize
            {
                test: /globalize/,
                loader: 'imports-loader?define=>false'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
