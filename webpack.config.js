// set up webpack configuration in this file
// filename MUST be webpack.config.js since webpack will look for it
// this will be a blueprint for the way webpack should behave within our project
// we will give it paths to our code and to where we would like it to output builds
// We can specify tons of different things in this file

// webpack uses Node.js to build our application

const path = require("path");

const webpack = require("webpack");

// create the main configuration object within our file
// write options within this object that tell webpack what to do

// For a basic configuration, we need to provide webpack with three properties: 
// entry, output, and mode 
// The entry point is the root of the bundle and the beginning of the dependency graph, so give it the relative path to the client's code
// webpack will next take the entry point we have provided, bundle that code, and 
// output that bundled code to a folder that we specify. best practice to put your bundled code into a folder named dist
// The final piece of our basic setup will provide the mode in which we want webpack to run.
// By default, webpack wants to run in production mode. In this mode, webpack will minify our code for us automatically, along with some other nice additions. 
// We want our code to run in development mode
module.exports = {
    entry: './assets/js/script.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    // we want webpack to use the jQuery package so we need to use a plugin
    // tell webpack which plugins we want to use
    // explain to webpack what $ means
    // define the $ and jQuery variables 
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ],
    mode: 'development'
};