'use strict';

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = 'develop';

process.argv.forEach(function (arg) {
	if (arg === '-p' || arg === '--production') {
		ENV = 'production';
	}
});

var config = {
	entry: {
		"game": "./js/index.js",
	},
	output: {
		path: path.join(__dirname, "/static"),
		publicPath: './',
		filename: '[name].bundle.js',
	},
	watch: ENV === 'develop',
	watchOptions: {
		aggregateTimeOut: 100
	},
	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
	},

	devtool: ENV === 'develop' ? 'eval' : 'source-map',

	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(\/node_modules\/|\/js\/libs|\\node_modules\\|\\js\\libs)/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}, {
			test: /\.(css|less)$/,
			loader: ExtractTextPlugin.extract('css!less?{"relativeUrls": "true"}!postcss-loader')
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract('style-loader', 'css-loader!resolve-url!sass-loader?sourceMap')
		}, {
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.html$/,
			loader: "ejs-loader"
		}, {
			test: /\.(png|jpg|svg|gif)?$/,
			loader: 'file?name=[path][name].[ext]',
			exclude: /\/fonts\//,
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file?name=[path][name].[ext]&mimetype=image/svg+xml'
		}, {
			test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file?name=[path][name].[ext]&mimetype=application/font-woff'
		}, {
			test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file?name=[path][name].[ext]&mimetype=application/font-woff'
		}, {
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file?name=[path][name].[ext]&mimetype=application/octet-stream'
		}, {
			test: /\.(eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file?name=[path][name].[ext]'
		},
		]
	},
	postcss: [
		autoprefixer({browsers: ['last 2 versions']})
	],
	plugins: [
		new webpack.ProvidePlugin({
			"$": "jquery",
			"jQuery": "jquery",
			"window.$": "jquery",
			"window.Tether": 'tether'
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify(ENV)
			}
		}),
		new ExtractTextPlugin(
			'[name].bundle.css',
			{allChunks: true}
		)
	]
};

if (ENV === 'production') {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				drop_console: true,
				unsafe: true
			}
		})
	);
}

module.exports = config;