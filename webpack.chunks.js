const path = require('path');
const fs = require('fs');

/**
 * @typedef {object} filterChunks
 * @property {1|0} mode 1 to include into bundle (0 to exclude from bundling) listed chunks ONLY
 * @property {string[]} names liste chunk names
 * @property {1|0} keepIndex 1 to keep 'index' chunk ANYWAY, 0 not to keep if filtered out
 */
const chunkNamesFilter = {
  mode: 1,
  list: ['page2'],
  keepIndex: 1,
};

function getPageNames() {
  const pagesDir = path.resolve(__dirname, 'pages');
  const filePaths = fs.readdirSync(pagesDir);
  const chunkNames = filePaths.map(file => path.parse(file).name);

  console.log("🚀 chunk found:", chunkNames);
  console.log("🚀 chunk rules:", chunkNamesFilter);

  const { mode, list, keepIndex } = chunkNamesFilter;

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

  console.log("🚀 chunk build:", chunkFiltered);

  return chunkFiltered;
}

const chunkNames = getPageNames();

module.exports = chunkNames;
