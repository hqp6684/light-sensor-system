var path = require('path');
var fs = require('fs');

// find and return the list of native node modules
var nodeModules = {};
fs
  .readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  target: 'node',
  entry: ['./src/main.ts'],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    //real dirname relative to the context option
    __dirname: true,
    // real filename relative to the context option
    __filename: true
  },
  watch: true,
  //devtool Choose a developer tool to enhance debugging.
  devtool: 'inline-source-map',

  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
