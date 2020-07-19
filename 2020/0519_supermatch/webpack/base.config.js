const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const polyfillsPC = ['@babel/polyfill', 'whatwg-fetch', 'element-closest-polyfill', 'custom-event-polyfill', 'formdata-polyfill'];
const polyfillsMobile = ['@babel/polyfill', 'whatwg-fetch'];

module.exports = {
  entry: {
    pc: [
      ...polyfillsPC,
      path.resolve(__dirname, '../src/js/pc.js'),
      path.resolve(__dirname, '../src/scss/pc.scss'),
      'swiper/swiper.scss',
    ],
    mobile: [
      ...polyfillsMobile,
      path.resolve(__dirname, '../src/js/mobile.js'),
      path.resolve(__dirname, '../src/scss/mobile.scss'),
      'swiper/swiper.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/(?!(swiper)).*/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
