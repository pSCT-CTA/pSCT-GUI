const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

    context: path.resolve(__dirname, '..'),

    entry: {
      dashboard: './src/js/dashboard.js',
      login: './src/js/login.js'
    },

    output: {
      path: path.resolve(__dirname, '../dist'),
      chunkFilename: '[name].bundle.js',
      //filename: '[name].bundle.[contenthash].js',
      filename: '[name].bundle.js',
      publicPath: path.resolve(__dirname, '..'),
    },

    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },

    plugins: [
        new HtmlWebpackPlugin({
          title: 'Custom template',
          // Load a custom template (lodash by default see the FAQ for details)
          template: './templates/layout.jinja2'
        }),
        new CleanWebpackPlugin(['../dist']),
        new webpack.HashedModuleIdsPlugin()
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                include: path.resolve(__dirname, '../src/css'),
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader',
            }
        ]
    }
};
