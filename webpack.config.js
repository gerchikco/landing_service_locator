const path = require('path');
const process = require('process');
const { env } = process;
const webpack = require('webpack');

/*
 * We've enabled Postcss, autoprefixer and precss for you. This allows your app
 * to lint  CSS, support variables and mixins, transpile future CSS syntax,
 * inline images, and more!
 *
 * To enable SASS or LESS, add the respective loaders to module.rules
 *
 * https://github.com/postcss/postcss
 *
 * https://github.com/postcss/autoprefixer
 *
 * https://github.com/jonathantneal/precss
 *
 */
const autoprefixer = require('autoprefixer');
const precss = require('precss');

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin')

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const FileManagerPlugin = require('filemanager-webpack-plugin');

const VersionFile = require('webpack-version-file');

const WebpackObfuscator = require('webpack-obfuscator');


module.exports = {
  mode: env.NODE_ENV || 'development',

  entry: {
    scripts: './src/scripts.js'
  },

  output: {
    path: path.resolve(__dirname, 'trg'),
    library: 'acc',
  },

  devtool: 'eval-source-map',

  plugins: [
    new webpack.ProgressPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // https://habr.com/ru/post/524260/
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename:'styles.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    // new WorkboxWebpackPlugin.GenerateSW({
    //   swDest: 'sw.js',
    //   clientsClaim: true,
    //   skipWaiting: false,
    // }),
    // https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options
    new WebpackObfuscator ({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      identifierNamesGenerator: 'hexadecimal',
      numbersToExpressions: true,
      rotateStringArray: true,
      simplify: true,
      shuffleStringArray: true,
      splitStrings: true,
      splitStringsChunkLength: 3,
      stringArrayThreshold: 0.75,
    }, [
      // 'excluded_bundle_name.js', // not used yet
    ]),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [{
            source: './trg/*.js',
            destination: './docs/',
          }],
        },
      },
    }),
    new VersionFile({
      data: {
        date: (new Date()).toGMTString(),
        environment: env.NODE_ENV || 'development',        
      },
      output: './docs/version.txt',
      package: './package.json',
      templateString: [
        `Build date: <%= date %>`,
        `Environment: <%= environment %>`,
        `Version: <%= name %>@<%= version %>`,
      ].join('\n'),
    }),
  ],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }, {
      test: /.css$/,

      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
        loader: "css-loader",

        options: {
          importLoaders: 1,
          sourceMap: true
        }
      }, {
        loader: "postcss-loader",

        options: {
          plugins: function () {
            return [
              precss,
              autoprefixer
            ];
          }
        }
      }]
    }]
  },

  devServer: {
    compress: true,
    contentBase: path.resolve(__dirname, './trg'),
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    open: true,
    port: 9000,
  },
};
