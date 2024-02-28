require('dotenv').config();
const path = require('path');
const { generateHtmlPlugins, generateEntries } = require('./webpack.utils');
const { PORT, DEV } = process.env;
const isDev = !!DEV;

console.log("🚀 is dev mode:", isDev);

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: generateEntries(),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: generateHtmlPlugins(),
  devServer: {
    port: PORT
  }
  // watchOptions: {
  //   ignored: isDev ? [] : ['dist/page2.bundle.js', 'dist/page3.bundle.js'] // Add the paths to the bundles you want to exclude
  // }
};
