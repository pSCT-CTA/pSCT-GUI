<<<<<<< Updated upstream
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');

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
        new CleanWebpackPlugin(['dist']),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      context: ''
                    }
                  }
                ]
            },
            {
              test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff",
              options: {
                name: '[name].[ext]',
                context: ''
              }
            },
            {
              test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "file-loader",
              options: {
                name: '[name].[ext]',
                context: ''
              }
            }
        ]
    }
};
=======
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');

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
        new CleanWebpackPlugin(['dist']),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      name: '[name].[ext]',
                      context: ''
                    }
                  }
                ]
            },
            {
              test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "url-loader?limit=10000&mimetype=application/font-woff",
              options: {
                name: '[name].[ext]',
                context: ''
              }
            },
            {
              test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: "file-loader",
              options: {
                name: '[name].[ext]',
                context: ''
              }
            }
        ]
    }
};
>>>>>>> Stashed changes
