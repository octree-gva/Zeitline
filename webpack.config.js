const path = require('path');

const config = {
  entry: './src/example.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // eslint-disable-line
    filename: 'd3-timeline.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|test|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};

module.exports = config; // eslint-disable-line
