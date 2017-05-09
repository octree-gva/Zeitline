const config = {
  entry: './src/index.js',
  output: {
    filename: './dist/zeitline.bundle.min.js',
    library: 'Zeitline',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|tests|dist)/,
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
