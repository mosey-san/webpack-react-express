const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const config = require('./server.config');

module.exports = (env, arg) => {
  const { mode } = arg;
  const isDev = mode === 'development';

  const webpackConfig = {
    mode,
    entry: {
      app: [
        path.resolve(config.src.js, 'app.js'),
        path.resolve(config.src.scss, 'app.scss'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: ['postcss-sort-media-queries', 'autoprefixer'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    devtool: isDev ? 'source-map' : false,
    output: {
      path: path.resolve(config.build.root),
      publicPath: '/',
      filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash].js',
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: config.src.fonts, to: 'fonts', noErrorOnMissing: true },
          { from: config.src.img, to: 'img', noErrorOnMissing: true },
        ],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: path.resolve(config.src.html, 'index.html'),
        filename: path.resolve(config.build.root, 'index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: isDev ? 'css/[name].css' : 'css/[name].[contenthash].css',
      }),
    ],
  };

  if (mode === 'development') {
    webpackConfig.plugins.push(
      new BrowserSyncPlugin({
        host: 'localhost',
        port: config.port,
        proxy: `https://localhost:443/`,
      })
    );
  }

  return webpackConfig;
};
