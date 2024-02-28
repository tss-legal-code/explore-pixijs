const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {
  mode: 'development',
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
};

function generateEntries() {
  const entryPoints = {};
  const pagesDir = path.resolve(__dirname, 'pages');
  const pageFiles = fs.readdirSync(pagesDir);

  pageFiles.forEach(file => {
    const name = path.parse(file).name;
    entryPoints[name] = `./src/${name}.ts`;
  });

  return entryPoints;
}

function generateHtmlPlugins() {
  const htmlPlugins = [];
  const pagesDir = path.resolve(__dirname, 'pages');
  const pageFiles = fs.readdirSync(pagesDir);

  pageFiles.forEach(file => {
    const name = path.parse(file).name;
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'pages', `${name}.html`),
        filename: `${name}.html`,
        chunks: [name]
      })
    );
  });

  return htmlPlugins;
}
