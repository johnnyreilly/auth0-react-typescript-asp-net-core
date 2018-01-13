const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

const shared = require('./webpack.config.shared');
const main = [
    'core-js',
    'whatwg-fetch',
    'react-hot-loader/patch',
    './src/index.tsx'
];
const vendor = shared.makeVendorEntry({ mainModules: main, modulesToExclude: ['semantic-ui-css'] });
const appSettings = require('../Web/appSettings.Development.json')

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: {
        main: main,
        vendor: vendor
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: "/"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false }),
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            watch: ['./src'] // optional but improves performance (fewer stat calls)
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.API_BASE_URI': JSON.stringify('http://localhost:5000/api'),
            'process.env.AUTH0_DOMAIN': JSON.stringify(appSettings['Auth0']['Domain']),
            'process.env.AUTH0_CLIENT_ID': JSON.stringify(appSettings['Auth0']['ClientId']),
            'process.env.AUTH0_REDIRECT_URI': JSON.stringify(appSettings['Auth0']['RedirectUri']),
            'process.env.AUTH0_AUDIENCE': JSON.stringify(appSettings['Auth0']['Audience']),
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    { loader: 'react-hot-loader/webpack' },
                    { loader: 'ts-loader', options: { happyPackMode: true, silent: true } }
                ],
                exclude: path.resolve(process.cwd(), 'node_modules'),
                include: path.resolve(process.cwd(), 'src'),
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            camelCase: true,
                            importLoaders: 2,
                            minimize: true
                        }
                    },
                    { loader: 'resolve-url-loader' },
                    { loader: "sass-loader?sourceMap" }
                ]
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 3000,
        clientLogLevel: 'warning',
        open: true,
        hot: true,
        historyApiFallback: true,
        stats: 'errors-only'
    }
};
