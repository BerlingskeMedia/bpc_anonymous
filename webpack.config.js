const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'bpca': './lib/index.js',
    'bpca.min': './lib/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'bpca',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],
};
