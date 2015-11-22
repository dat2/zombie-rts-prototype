var config = require('./config');

module.exports = {
  entry: config.paths.src + '/index.js',

  output: {
    filename: 'bundle.js',
    path: config.paths.out
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

  devtool: 'eval'
};
