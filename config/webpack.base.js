const path = require('path');
const PATHS = require('./paths');
const alias = require('./alias');
const webpack = require('webpack');
const webpackMode = require('webpack-mode');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    bundle: [
      '@babel/polyfill',
      path.join(PATHS.SRC, 'index.tsx'),
      path.join(PATHS.STYLES, 'styles.scss')
    ]
  },
  resolve: {
    modules: ['node_modules', PATHS.SRC],
    extensions: ['.ts', '.js', '.jsx', '.tsx', '.json', '.scss', '.css', '.yml', '.mp3'],
    alias: {
      ...alias,
      three$: 'three/build/three.min.js',
      'three/.*$': 'three'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        exclude: '/node_modules/',
        loader: 'tslint-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          webpackMode.isDevelopment
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.join(PATHS.STYLES, 'abstracts', '_variables.scss'),
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: webpackMode.isProduction
                ? '/images/[name]_[hash:8].[ext]'
                : '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.(obj|mtl)$/,
        loader: 'file-loader',
        options: {
          name: webpackMode.isProduction
            ? '/objects/[name]/[hash:8].[ext]'
            : '[name].[ext]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: webpackMode.isProduction
                ? '/sounds/[name]_[hash:8].[ext]'
                : '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.SRC, 'index.html'),
      favicon: './src/public/assets/images/favicon.png',
      filename: 'index.html',
      inject: 'body',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(webpackMode.isDevelopment ? 'development' : 'production')
      }
    })
  ]
};
