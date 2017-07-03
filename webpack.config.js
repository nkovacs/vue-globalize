var webpack = require('webpack');
var path = require('path');
var pack = require('./package.json');

function resolve(dir) {
    return path.join(__dirname, dir);
}

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
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|dist)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['env', { 'modules': false }],
                        'stage-2'
                    ]
                }
            },
            {
                test: /\.json/,
                loader: 'json-loader'
            },
            // fix globalize
            {
                test: /node_modules\/globalize/,
                loader: 'imports-loader?define=>false'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
