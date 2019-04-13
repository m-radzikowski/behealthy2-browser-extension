const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map', // evals (generated in default "eval" mode for development) are not allowed in Chrome extensions
});
