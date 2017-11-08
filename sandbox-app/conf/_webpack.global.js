const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const GlobalWebpackConfig = {
    entry: {
        scripts: './sandbox-app/app/index.js',
        sandboxRunner: './sandbox-app/app/sandbox/SandboxRunner.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, './../app')
                ],
                query: {
                    presets: ['es2015', 'stage-2', 'react'],
                    plugins: ['transform-object-rest-spread']
                }
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            globalVars: {
                                nodeModulesPath: '\'~\'',
                                coreModulePath: '\'~\''
                            },
                            include: path.resolve(__dirname, '../')
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            NavFrontendModules: path.resolve(__dirname, './../../packages/node_modules')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './sandbox-app/index.production.ejs',
            filename: 'index.html',
            chunks: ["scripts"],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            template: './sandbox-app/index.production.ejs',
            filename: 'sandboxRunner.html',
            chunks: ["sandboxRunner"],
            inject: 'body'
        })
    ]
};

module.exports = GlobalWebpackConfig;
