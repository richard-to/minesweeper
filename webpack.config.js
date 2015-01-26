var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'js'),
    publicPath: 'js/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx' }
    ]
  }
};