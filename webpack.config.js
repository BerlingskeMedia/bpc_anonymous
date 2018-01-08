const path = require('path');
const webpack = require('webpack');

const version = require("./package.json").version;

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'bpca.js',
    path: path.resolve(__dirname, 'dist', version),
    library: 'bpca',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({ minimize: true })
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // })
  ],
};
