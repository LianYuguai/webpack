const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const threads = require('os').cpus().length;
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  // 入口
  entry: "./src/main.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/[name].js",
    // 打包前清空dist目录
    clean: true
  },
  module: {
    // loader
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 将css提取成单独的文件
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env', // 解决大多数样式兼容性问题
                    {
                      // 其他选项
                    },
                  ],
                ],
              },
            },
          },
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: MiniCssExtractPlugin.loader // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-preset-env',
                  {
                    // 其他选项
                  },
                ],
              ],
            },
          },
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
              plugins: ['@babel/plugin-transform-runtime'] // 减少代码体积
            }
          }
        ]
      }
    ],

  },
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin({
        parallel: threads // 开启多进程和设置进程数
      })
    ],
    splitChunks: {
      chunks: 'all',
      // minSize: 20000,
      // minRemainingSize: 0,
      // minChunks: 1,
      // cacheGroups: {
      // defaultVendors: {
      //   test: /[\\/]node_modules[\\/]/,
      //   priority: -10,
      //   reuseExistingChunk: true,
      // },
      // default: {
      //   minSize: 0,
      //   minChunks: 1,
      //   priority: -20,
      //   reuseExistingChunk: true,
      // },
      // },
    },
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modeules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslints'),
      threads
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css"
    })
  ],
  mode: "production",

}