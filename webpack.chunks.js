/**
 * @typedef {object} filterChunks
 * @property {1|0} mode 1 to include into bundle (0 to exclude from bundling) listed chunks ONLY
 * @property {string[]} names liste chunk names
 * @property {1|0} keepIndex 1 to keep 'index' chunk ANYWAY, 0 not to keep if filtered out
 */
const chunkNamesFilter = {
  mode: 1,
  list: ['index'],
  keepIndex: 1,
};

module.exports = chunkNamesFilter;
