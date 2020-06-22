const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    pc: ['@babel/polyfill', './src/js/ui.pc.js', './src/scss/pc.scss'],
    mobile: ['@babel/polyfill', './src/js/ui.mobile.js', './src/scss/mobile.scss']
  },
  output: {
    path: path.resolve(__dirname, './dist/js'),
    filename: 'ui.[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({filename: '../css/[name].css' })
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
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  mode: 'production'
}