var webpackConfig = require('../../webpack.config.js');

webpackConfig.module.rules.forEach(function(rule) {
    if (rule.loader === 'babel-loader') {
        rule.query.plugins = rule.query.plugins || [];
        rule.query.plugins.push('istanbul');
    }
});

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
        reporters: ['spec', 'coverage'],
        files: ['./index.js'],
        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        }
    });
};
