const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserWebpackPlugin = require('terser-webpack-plugin')
const threads = require('os').cpus().length;
module.exports = {
  // 入口
  entry: "./src/main.js",
  devtool: "cheap-module-source-map",
  output: {
    // path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    // 打包前清空dist目录
    clean: true
  },
  module: {
    // loader
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 500 * 1024 // 小于500kb 转base64,
          }
        },
        generator: {
          filename: "static/images/[hash:8][ext][query]"
        }
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash][ext][query]"
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: threads
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              cacheDirectory: true,
              cacheCompression: false,
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
      }
    ],

  },
  // 插件
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modeules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslints'),
      threads, //开启多进程和设置进程数
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    // new TerserWebpackPlugin({
    //   parallel: threads // 开启多进程和设置进程数
    // })
  ],
  mode: "development",
  // 开发服务器
  devServer: {
    host: 'localhost',
    port: '8080',
    open: true, //自动打开浏览器
    hot: true
  },

}