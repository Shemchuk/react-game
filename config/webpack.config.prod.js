const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../build')
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../build'),
    port: 8085
  }
});
