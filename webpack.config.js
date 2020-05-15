const path = require('path');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.[chunkhash].js",
        path: path.resolve(__dirname, 'public')
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin()
    ]
};
