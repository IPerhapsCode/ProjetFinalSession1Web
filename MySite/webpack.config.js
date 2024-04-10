const path = require('path');

module.exports = {
  entry: {
		global : './src/global.js'
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
