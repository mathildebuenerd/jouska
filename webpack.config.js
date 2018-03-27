const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./www/js/index.js",
    output: {
        path: path.resolve(__dirname, "./www/dist"),
        filename: "./bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader",
                options: {
                    configFileName: 'tsconfig.webpack.json'
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.css$/,
                loader: "css-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js", ".html", ".css"]
    },
    devtool: "#inline-source-map"
}