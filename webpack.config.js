var webpack = require('webpack');
const path = require('path');

module.exports = {
    context: __dirname + "/app",
    entry: [
        "./index.js",
        "./index.html",
    ],
    devtool: 'source-map',
    output: {
        path: "./build",
        filename: 'bundle.js', // Try also [name].js
        publicPath: 'http://localhost:8080/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            }
        ]
    },
    // plugins: [
    //   new webpack.HotModuleReplacementPlugin()
    // ],
    devServer: {
        inline: true,
        hot: false,
        contentBase: "./build"
    }
};
