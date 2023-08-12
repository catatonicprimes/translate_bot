const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      'fs': require.resolve('fs-browserify'),
    }
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};