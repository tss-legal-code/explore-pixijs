const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { PORT, DEV, MAX_ASSET_SIZE, DIST_FOLDER, CHUNKS_FOLDER } = process.env;

/**
 * @typedef {object} select
 * @property {1|0} mode 1 to include into bundle (0 to exclude from bundling) listed chunks ONLY
 * @property {string[]} names liste chunk names
 * @property {1|0} keepIndex 1 to keep 'index' chunk ANYWAY, 0 not to keep if filtered out
 */
const chunkSelectionRules = {
  mode: 1,
  list: [],
  keepIndex: 1,
};

const isDev = !!DEV;
const port = PORT;
const maxAssetSize = +MAX_ASSET_SIZE;
const outputPath = path.resolve(__dirname, DIST_FOLDER);
console.log("🚀 ~ outputPath:", outputPath);
const chunksPath = path.resolve(__dirname, CHUNKS_FOLDER);
console.log("🚀 ~ chunksPath:", chunksPath);
const chunkNames = getChunks(chunkSelectionRules);
console.log("🚀 ~ chunkNames:", chunkNames);
const entries = generateEntries(chunkNames);
console.log("🚀 ~ entries:", entries);
const plugins = generateHtmlPlugins(chunkNames);
console.log("🚀 ~ plugins:", plugins);

function getChunks(chunkSelectionRules) {
  const filePaths = fs.readdirSync(chunksPath);
  const detectedChunkNames = filePaths.map(filePath => path.parse(filePath).name);

  console.log("🚀 detected chunks       :", detectedChunkNames);
  console.log("🚀 chunk selection sules :", chunkSelectionRules);

  const { mode, list, keepIndex } = chunkSelectionRules;

  // no actual filering of chunk names is required
  if (!list.length) {
    return detectedChunkNames;
  }

  // filter chunk names
  const selectedChunkNames = detectedChunkNames.filter((chunkName) => {
    return mode === 1 ? list.includes(chunkName) : !list.includes(chunkName);
  });

  // handle corner case: keep 'index' chunk or not
  if (keepIndex && !selectedChunkNames.includes('index')) {
    selectedChunkNames.push('index');
  }

  console.log("🚀 chunks to be built    :", selectedChunkNames);

  return selectedChunkNames;
}

function getChunkAssetPath(chunkName, assetName) {
  return path.resolve(chunksPath, chunkName, assetName);
}

function generateEntries(chunkNames) {
  return chunkNames.reduce((acc, chunkName) => {
    acc[chunkName] = getChunkAssetPath(chunkName, 'index.ts');
    return acc;
  }, {});
}

function generateHtmlPlugins(chunkNames) {
  return chunkNames.reduce((acc, chunkName) => {
    acc.push(
      new HtmlWebpackPlugin({
        template: getChunkAssetPath(chunkName, 'index.html'),
        filename: `${chunkName}.html`,
        chunks: [chunkName]
      })
    );
    return acc;
  }, []);
}

// throw new Error('stop');

module.exports = {
  isDev,
  entries,
  outputPath,
  plugins,
  port,
  maxAssetSize,
};