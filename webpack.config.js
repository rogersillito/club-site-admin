const webpack = require('webpack');
const path = require('path');
const colors = require('colors');

var outputFilenameSuffix = '.bundle.js';
if (process.env.NODE_ENV === 'production') {
  console.log(colors.red('DOING A PRODUCTION BUILD!\n'));
	outputFilenameSuffix = '.prod.bundle.js';
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
      'app/globalInit',
			m[moduleName]
    ];
    console.log(`Entry Point: ${m[moduleName]} \r\n             --> ${colors.bgGreen.white(moduleName + outputFilenameSuffix)}`);
  });
  return mapping;
}

const config = {
  entry: createEntryPointMappings(),
  output: {
    filename: '[name]' + outputFilenameSuffix,
    path: path.resolve(__dirname, 'public/js/bundles')
  },
  stats: {
    // https://webpack.js.org/configuration/stats/
    maxModules: Infinity,
		// reduce what we see in console output to stuff we care about
    exclude: [
        /\.\/node_modules\/core-js/ 
    ]
  },
  resolve: {
    // https://webpack.js.org/concepts/module-resolution/#module-paths
    modules: [
      // order of locations to search for referenced modules
      "node_modules",
			path.resolve(__dirname, 'public/js')
    ],
    alias: {
			'jquery.smartmenus': 'smartmenus' // https://github.com/vadikom/smartmenus/issues/66
    }
  },
  // https://survivejs.com/webpack/building/source-maps/
  devtool: 'source-map',
  resolveLoader: { // where to get loaders from
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: function (modPath)
        {
          return !!modPath.match(/(node_modules)/);
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
                useBuiltIns: true,
                // enable this option to see all browser versions targeted
                // and transforms applied in console output
                debug: false
              }],
							'react'
            ],
            plugins: [
							'transform-object-rest-spread'
            ],
            cacheDirectory: true
          }
        }
      }
    ]
  },
  plugins: [
    // https://webpack.js.org/plugins/provide-plugin/
    new webpack.ProvidePlugin({
      // automatically load modules to satisfy global dependencies
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery', 
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    // https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      // node_modules dirs get bundled into a 'shared' bundle 
      name: 'shared',
      minChunks: function (module) {
        return module.context &&
          (module.context.indexOf('node_modules') !== -1);
      }
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
    sourceMap: config.devtool && (config.devtool.indexOf("sourcemap") >= 0 || config.devtool.indexOf("source-map") >= 0)
  }));
}

module.exports = config;
