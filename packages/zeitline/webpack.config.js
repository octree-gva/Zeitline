const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production'; // eslint-disable-line

const config = {
  entry: './src/index.js',
  output: {
    filename: production ? './dist/zeitline.bundle.min.js' : './dist/zeitline.bundle.js',
    library: 'Zeitline',
    libraryTarget: 'umd',
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
  plugins: production ? [
    new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
  ] : [],
};

module.exports = config;
