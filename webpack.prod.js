const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new ZipPlugin({
			path: path.resolve(__dirname, 'dist'),
			filename: 'release.zip',
		}),
	],
});
