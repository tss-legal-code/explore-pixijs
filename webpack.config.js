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
const chunksPath = path.resolve(__dirname, CHUNKS_FOLDER);
const chunkNames = getChunks(chunkSelectionRules);
const entries = generateEntries(chunkNames);
const plugins = generateHtmlPlugins(chunkNames);

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: outputPath,
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
  plugins: plugins,
  devServer: {
    port
  },
  performance: {
    maxAssetSize,
    hints: false
  }
};

// watchOptions: {
//   ignored: isDev ? [] : ['dist/page2.bundle.js', 'dist/page3.bundle.js'] // Add the paths to the bundles you want to exclude
// },

function getChunks(chunkSelectionRules) {
  const filePaths = fs.readdirSync(chunksPath);
  const detectedChunkNames = filePaths.map(filePath => path.parse(filePath).name);

  console.log("🚀 detected chunks         :", detectedChunkNames);
  console.log("🚀 chunk selection rules   :", chunkSelectionRules);

  const { mode, list, keepIndex } = chunkSelectionRules;

  // no actual filering of chunk names is required
  if (!list.length) {
    console.log("🚀 chunk selection rules list is empty --> building all detected chunks");
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

  console.log("🚀 chunks to be built      :", selectedChunkNames);

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
