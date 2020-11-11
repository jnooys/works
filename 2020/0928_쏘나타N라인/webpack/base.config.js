const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entryCommon = [
  '@babel/polyfill',
  path.join(__dirname, '../src/js/libs/polyfills.js'),
];

module.exports = {
  entry: {
    event01: [
      ...entryCommon,
      path.join(__dirname, '../src/js/event01.js'),
      path.join(__dirname, '../src/scss/event01.scss'),
    ],
    event02: [
      ...entryCommon,
      path.join(__dirname, '../src/js/event02.js'),
      path.join(__dirname, '../src/js/register/index.js'),
      path.join(__dirname, '../src/scss/event02.scss'),
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules\/(?!(overlayscrollbars)).*/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  target: ['web', 'es5'],
};
