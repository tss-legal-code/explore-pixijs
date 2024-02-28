require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { PORT, DEV } = process.env;
const isDev = !!DEV;

const chunkNames = require('./webpack.chunks');
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

function generateEntries() {
  return chunkNames.reduce((acc, name) => {
    acc[name] = `./src/${name}.ts`;
    return acc;
  }, {});
}

function generateHtmlPlugins() {
  return chunkNames.reduce((acc, name) => {
    acc.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'pages', `${name}.html`),
        filename: `${name}.html`,
        chunks: [name]
      })
    );
    return acc;
  }, []);
}