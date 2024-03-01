const { isDev, entries, outputPath, plugins, port, maxAssetSize } = require('./webpack.constants');

console.log("🚀 is dev mode:", isDev);

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