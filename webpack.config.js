const path = require("path"); //include a built in node module
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: ["babel-polyfill", "./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"), //dir is the current direcory i.e forky to bundle the modules in dist's js folder
    filename: "js/bundle.js"
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
