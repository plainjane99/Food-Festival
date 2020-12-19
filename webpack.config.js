// set up webpack configuration in this file
// filename MUST be webpack.config.js since webpack will look for it
// this will be a blueprint for the way webpack should behave within our project
// we will give it paths to our code and to where we would like it to output builds
// We can specify tons of different things in this file

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const path = require("path");

const webpack = require("webpack");

// for the manifest plugin to work
const WebpackPwaManifest = require("webpack-pwa-manifest");

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
    entry: {
        // add entry points so webpack will know where to start the the bundle of dependencies
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        // Our build step will create a series of bundled files, one for each listing in the entry object
        // The name of each attribute in the entry object will be used in place of [name] in each bundle.js file that is created
        filename: "[name].bundle.js"
    },
    module: {
        // identify the type of files to pre-process using the test property through a regular expression
        rules: [
            {
                test: /\.jpg$/i,
                // this is where the loader is implemented
                use: [
                    {
                        loader: "file-loader",
                        // returns the name of the file with the file extension 
                        options: {
                            name(file) {
                                return "[path][name].[ext]"
                            },
                            // function changes our assignment URL by replacing the ../ from our require() statement with /assets/
                            publicPath: function (url) {
                                return url.replace("../", "/assets/")
                            }
                        }
                    },
                    // optimize the images
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
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

        // configure analyzerMode with a value of "static"
        // which will output an HTML file called report.html
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // the report outputs to an HTML file in the dist folder
        }),

        // manifest plugin
        // invoke constructor, instantiate WebpackPwaManifest
        // argument is an object
        new WebpackPwaManifest({
            // name for desktop app icon
            name: "Food Event",
            // name for pwa icon
            short_name: "Foodies",
            description: "An app that allows you to view upcoming food events.",
            // specify homepage for the PWA relative to the location of the manifest file
            start_url: "../index.html",
            // splash screen's background color
            background_color: "#01579b",
            // tool bar color
            theme_color: "#ffffff",
            // tells webpack whether or not it should generate unique fingerprints
            // so that each time a new manifest is generated,
            // it looks like this: manifest.lhge325d.json
            fingerprints: false,
            // determines whether the link to the manifest.json is added to the HTML. 
            // Because we are not using fingerprints, we can also set inject to be false
            // We will hardcode the path to the manifest.json instead, just like we would in an application without webpack
            inject: false,
            // different sizes of icons for the app
            icons: [{
                // path to the icon image
                src: path.resolve("assets/img/icons/icon-512x512.png"),
                // take the src image and create icons with the dimensions listed in sizes
                sizes: [96, 128, 192, 256, 384, 512],
                // designates where the icons will be sent after the creation of the web manifest
                destination: path.join("assets", "icons")
            }]
        })
    ],
    mode: 'development'
};