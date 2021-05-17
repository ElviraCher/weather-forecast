const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    environment: {
      arrowFunction: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', { targets: "ie 11" }]
          }
        }
      }
    ]
  }
};
