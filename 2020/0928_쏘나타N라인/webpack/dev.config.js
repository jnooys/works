const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./base.config');

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/dist/',
    hot: true
  },
});
