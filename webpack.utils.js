const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const chunksOverrides = require('./webpack.chunks');

const chunkNames = getChunkNames(chunksOverrides);

function getChunkNames(chunksOverrides) {
  const pagesDir = path.resolve(__dirname, 'pages');
  const filePaths = fs.readdirSync(pagesDir);
  const chunkNames = filePaths.map(file => path.parse(file).name);

  console.log("🚀 chunks:", chunkNames);
  console.log("🚀 overrides:", chunksOverrides);

  const { mode, list, keepIndex } = chunksOverrides;

  if (!list.length) {
    return chunkNames;
  }

  const filterFn = mode === 1
    ? (name) => list.includes(name)
    : (name) => !list.includes(name);

  const chunkFiltered = chunkNames.filter(filterFn);

  if (keepIndex && !chunkFiltered.includes('index')) {
    chunkFiltered.push('index');
  }

  console.log("🚀 to build:", chunkFiltered);

  return chunkFiltered;
}

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

module.exports = {
  generateEntries,
  generateHtmlPlugins
};