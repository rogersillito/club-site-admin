const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

if (process.env.NODE_ENV === 'production') {
  console.log(colors.red('DOING A PRODUCTION BUILD!\n'));
}

// define entry points
// https://webpack.js.org/concepts/entry-points/#multi-page-application
const entryPoints = [
	{'app': './public/js/app/main.js'}
];

function createEntryPointMappings() {
  // defines our entry module mappings and prepend modules to output bundles
  const mapping = {};
  entryPoints.forEach(m => {
		const moduleName = Object.keys(m)[0];
    mapping[moduleName] = [
      'babel-polyfill',
			m[moduleName]
    ];
    console.log(`Entry Point: ${m[moduleName]} \r\n             --> ${colors.bgGreen.white(moduleName)}.bundle.js`);
  });
  return mapping;
}

const config = {
  entry: createEntryPointMappings(),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'kykloud.Web/Scripts/bundles')
  },
  stats: {
    // https://webpack.js.org/configuration/stats/
    maxModules: Infinity,
		// reduce what we see in console output to stuff we care about
    exclude: [
        /\.\/~\/core-js/ 
    ]
  },
  resolve: {
    // https://webpack.js.org/concepts/module-resolution/#module-paths
    modules: [
      // order of locations to search for referenced modules
      path.resolve(__dirname, 'kykloud.Web/Scripts'),
      "node_modules"
    ],
    alias: {
      // use nicer module names to avoid specifying version numbers
      jquery: 'jquery-1.12.3'
    }
  },
  // https://survivejs.com/webpack/building/source-maps/
  devtool: 'source-map',
  resolveLoader: { // where to get loaders from
    modules: ['node_modules']
  },
	// react was 
  // "version": "0.13.3" - still works?
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {}
        }
      },
      {
        test: /\.js$/,
        exclude: function (modulePath)
        {
          // here we specify what is and is not "babelled":
          // if this returns true for a module, babel ignores it
          const include_regex = [
            /kykloud\.Web\\Scripts\\kykloud.shared/
          ];
          for(var i = 0; i < include_regex.length; i++) {
            if (modulePath.match(include_regex[i])) {
              // console.log("modulePath = ", modulePath);
              return false;
            }
          }
          return !!modulePath.match(/(node_modules|kykloud\.Web\\Scripts)/);
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                // configure what level of browser JavaScript support we want:
                targets: {
                  browsers: ['last 3 versions', 'ie >= 8']
                },
                exclude: [
                  'transform-regenerator' // IE8 doesn't like regenerator-runtime!
                ],
                useBuiltIns: true,
                // enable this option to see all browser versions targeted
                // and transforms applied in console output
                debug: false
              }]
            ],
            plugins: [
              ['transform-es2015-modules-commonjs', { "loose": true }], // IE8!
              'transform-es3-member-expression-literals', // IE8!
              'transform-es3-property-literals' // IE8!
            ], 
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.component.js$/,
        use: {
          loader: 'component-custom-tags-loader', 
          options: {}
        }
      }
    ]
  },
  plugins: [
    // https://webpack.js.org/plugins/provide-plugin/
    new webpack.ProvidePlugin({
      // automatically load modules to satisfy global dependencies
      // e.g. a module needs global "$" - load the jquery module and set "$" with what it exports.
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery', 
      knockout: 'knockout',
      kykloud: 'kykloud.shared/lib/kykloudInit',
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch-ie8'
    }),
    // https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      // shared script dependencies found in either node_modules
      // or the 'Scripts' dir will be bundled into the 'common' bundle 
      name: 'common',
      minChunks: function (module) {
        return module.context &&
          (module.context.indexOf('node_modules') !== -1 ||
           module.context.indexOf('kykloud.Web\\Scripts') !== -1); // Windows paths!
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({ 
      // extracts the common webpack runtime into a separate bundle
      // which avoids having to re-version the shared bundle each build
      name: 'webpackBootstrap' 
    })
  ],
  // this helps ensure internal ids in output bundles are minimally
  // volatile: ensures output files only change when component modules change
  // https://github.com/webpack/docs/wiki/list-of-plugins#2-explicit-vendor-chunk
  recordsPath: path.resolve(__dirname, 'webpack.records.json')
};

// Minification settings added for production builds
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: config.devtool && (config.devtool.indexOf("sourcemap") >= 0 || config.devtool.indexOf("source-map") >= 0),
    // IE8! - some serious compromises made here! http://johnliu.net/blog/2017/1/how-to-tell-webpack-uglify-to-support-ie8 
    //      - Hopefully we can ditch this when IE8 is no longer required!
    mangle: false,
    mangleProperties: {
      screw_ie8: false,
      ignore_quoted: true // do not mangle quoted properties and object keys
    },
    compress: {
      screw_ie8: false
      // properties: false // optional: don't convert foo["bar"] to foo.bar
    },
    output: {
      screw_ie8: false
    }
    // END IE8!
  }));
}

module.exports = config;
