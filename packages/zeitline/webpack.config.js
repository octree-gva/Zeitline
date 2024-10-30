import path from "path";
import { fileURLToPath } from "url";

// Get the filename of the current module
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module
const __dirname = path.dirname(__filename);

const production = process.env.NODE_ENV === "production"; // eslint-disable-line

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: production ? "./zeitline.bundle.min.js" : "./zeitline.bundle.js",
    library: "Zeitline",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Matches any .css file
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Turns CSS into CommonJS
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|test|dist)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  optimization: {
    minimize: production, // Minimize only in production mode
  },
  mode: production ? "production" : "development",
  devtool: production ? "source-map" : "inline-source-map",
};
export default config;
