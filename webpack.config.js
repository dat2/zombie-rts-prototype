var config = require('./config');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    config.paths.src + '/index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: config.paths.build
  },

  // for PIXI.js
  node: {
    fs: 'empty'
  },

  module: {
    loaders: [
      // babeljs
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?cacheDirectory=true' },
      { test: /\.json$/, loader: 'json' }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  devtool: 'eval'
};
