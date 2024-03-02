const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const colors = require('colors/safe');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { PORT, DEV, MAX_ASSET_SIZE, DIST_FOLDER, CHUNKS_FOLDER, HOSTNAME } = process.env;
const chunkSelectionRules = require('./webpack.select');


const isDev = !!DEV;
const port = PORT;
const hostname = HOSTNAME;
const maxAssetSize = +MAX_ASSET_SIZE;
const outputPath = path.resolve(__dirname, DIST_FOLDER);
const chunksPath = path.resolve(__dirname, CHUNKS_FOLDER);
const chunkNames = getChunks(chunkSelectionRules);

if (isDev) {
  const wing = 35;
  const title = '[chunk URLs]';
  console.log(colors.green("=".repeat(wing)), colors.red.bold(title), colors.green("=".repeat(wing)));
  chunkNames.forEach(chunkName => {
    const url = `http://${hostname}:${port}/${chunkName}.html`;
    console.log(colors.blue(url));
  });
  console.log(colors.green("=".repeat(wing * 2 + title.length + 2)));
}

const rootPage = `/${chunkNames[0]}.html`;
const entries = generateEntries(chunkNames);
const htmlPlugins = generateHtmlPlugins(chunkNames);
const copyPlugins = generateCopyPlugins(chunkNames);

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
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      }
    ]
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css'
    }),
    ...copyPlugins
  ],
  devServer: {
    port,
    host: hostname,
    historyApiFallback: {
      rewrites: [
        // access 'top' chunk from root
        { from: '\/', to: rootPage }
      ]
    }
  },
  performance: {
    maxAssetSize,
    hints: false
  }
};

function getChunks(rules) {
  const filePaths = fs.readdirSync(chunksPath);
  const detectedChunkNames = getNormalizedChunks(filePaths.map(filePath => path.parse(filePath).name));

  console.log("🚀 detected chunks         :", detectedChunkNames);
  console.log("🚀 chunk selection rules   :", rules);

  const { mode, list } = rules;

  // no actual filering of chunk names is required
  if (!('list' in rules)) {
    console.log("🚀 chunk selection rules list is not defined --> building all detected chunks");
    return detectedChunkNames;
  }

  let selectedChunkNames = null;

  // filter chunk names
  if (list === 'latest') {
    const latest = detectedChunkNames.filter(chunkName =>
      /^\d{3}/.test(chunkName)
    ).sort().reverse()[0];
    selectedChunkNames = latest ? [latest] : detectedChunkNames;
  } else {
    selectedChunkNames = detectedChunkNames.filter((chunkName) => {
      const isListed = list.some(listItem => {
        if (typeof listItem === 'string') {
          return listItem === chunkName;
        }
        if (listItem instanceof RegExp) {
          return listItem.test(chunkName);
        }
        if (listItem === 'latest') {

        }
        // other listItem types are not supported
      });
      return mode ? isListed : !isListed;
    });
  }

  console.log("🚀 chunks to be built      :", selectedChunkNames);

  return selectedChunkNames;
}

/**
 * get chunkNames with 'index' chunk first (for sake of layout ordering)
 * @param {string[]} chunkNames 
 * @param {string} indexChunkName 
 * @returns 
 */
function getNormalizedChunks(chunkNames, indexChunkName = 'index') {
  const indexOfIndexChunk = chunkNames.indexOf(indexChunkName);
  const chunksNamesCopy = [...chunkNames];
  if (indexOfIndexChunk > 0) {
    // handle if index chunk is second or further
    chunksNamesCopy.splice(indexOfIndexChunk, 1);
    chunksNamesCopy.unshift(indexChunkName);
  }
  return chunksNamesCopy;
};

/**
 * 1) Compose file path.
 * 2) Check if a file exists. If not, create an empty file.
 * @param {*} chunkName 
 * @param {*} assetName 
 * @returns 
 */
function getChunkFilePath(chunkName, assetName) {
  const filePath = path.resolve(chunksPath, chunkName, assetName);
  ensureFileExists(filePath);
  return filePath;
}

/**
 * Check if a file exists. If not, create an empty file.
 * @param {string} filePath - The path of the file to check/create.
 * @returns {boolean} - True if the file exists or was created, false otherwise.
 */
function ensureFileExists(filePath) {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    fs.writeFileSync(filePath, '');
  }
}

function generateEntries(chunkNames) {
  return chunkNames.reduce((acc, chunkName) => {
    acc[chunkName] = ['index.ts', 'index.scss']
      .map((fileName) =>
        getChunkFilePath(chunkName, fileName));

    return acc;
  }, {});
}

function generateHtmlPlugins(chunkNames) {
  const indexTemplateParameters = function (compilation, assets, options) {
    // Generate hyperlinks based on chunkNames
    const tableOfContents = chunkNames.map(chunkName => {
      return `<div class="chunkAnchorContainer">
        <a class="chunkAnchorElement" href="${chunkName}.html">${chunkName}</a>
      </div>`;
    }).join('');

    return {
      htmlWebpackPlugin: {
        options: {
          tableOfContents
        }
      }
    };
  };

  return chunkNames.reduce((acc, chunkName) => {
    acc.push(new HtmlWebpackPlugin({
      template: getChunkFilePath(chunkName, 'index.html'),
      filename: `${chunkName}.html`,
      chunks: [chunkName],
      templateParameters: indexTemplateParameters
    }));
    return acc;
  }, []);
}

/**
 * Function to generate copy patterns based on the actual folder structure
 * @param {string} chunkNames - Path to the chunks folder
 * @returns {Array<Object>} - Array of copy patterns
 */
function generateCopyPlugins(chunkNames) {
  const patterns = [];
  chunkNames.forEach((chunkName) => {
    const assetsPath = path.join(chunksPath, chunkName, 'assets');
    if (fs.existsSync(assetsPath) && fs.readdirSync(assetsPath).length) {
      patterns.push({
        from: assetsPath,
        to: `assets`,
        toType: 'dir',
        // noErrorOnMissing: true // Ignore if assets folder doesn't exist in some chunks
      });
    }
  });

  const result = patterns.length
    ? [new CopyPlugin({ patterns })]
    : [];

  return result;
}



