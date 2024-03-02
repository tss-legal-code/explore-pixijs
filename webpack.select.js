/**
 * @typedef {object} select
 * @property {boolean} mode 'truthy' means to include into bundle ('falsy' means to exclude from bundling) listed chunks ONLY
 * @property {[string|RegExp|"*latest*"][]} names list of chunk names or regular expressions
 */
const chunkSelectionRules = {
  mode: 1,
  list: ['*latest*', 'index'],
};

module.exports = chunkSelectionRules;