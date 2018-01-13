const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

const shared = require('./webpack.config.shared');
const main = [
    'core-js',
    'whatwg-fetch',
    './src/index.tsx'
];
const vendor = shared.makeVendorEntry({ mainModules: main, modulesToExclude: ['semantic-ui-css'] })
const appSettings = require('../Web/appSettings.Production.json')

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: {
        main: main,
        vendor: vendor
    },
    output: {
        path: path.join(process.cwd(), '..', 'Web', 'wwwroot'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            memoryLimit: 4096,
            checkSyntacticErrors: true
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
        new StyleExtHtmlWebpackPlugin({
            minify: true
        }),
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.API_BASE_URI': JSON.stringify('api'), // in prod the API and the client app are served from the same location
            'process.env.AUTH0_DOMAIN': JSON.stringify(appSettings['Auth0']['Domain']),
            'process.env.AUTH0_CLIENT_ID': JSON.stringify(appSettings['Auth0']['ClientId']),
            'process.env.AUTH0_REDIRECT_URI': JSON.stringify(appSettings['Auth0']['RedirectUri']),
            'process.env.AUTH0_AUDIENCE': JSON.stringify(appSettings['Auth0']['Audience']),
        }),
        new HtmlWebpackPlugin({
            hash: true,
            inject: true,
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    { loader: 'ts-loader', options: { transpileOnly: true } }
                ],
                exclude: path.resolve(process.cwd(), 'node_modules'),
                include: path.resolve(process.cwd(), 'src'),
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
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
                })
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
