// Minify CSS
// https://github.com/gruntjs/grunt-contrib-cssmin#cssmin-task
// 3.x: https://github.com/jakubpawlowicz/clean-css/tree/c9542e8020c63946ec9ff994fdf57692ecffe33f
module.exports = {
  options: {
    shorthandCompacting: false,
    sourceMap: true,
    sourceMapInlineSources: true,
    // keepBreaks: true,
    keepSpecialComments: 0,
    roundingPrecision: -1
  },
  dist: {
    files: {
      'public/styles/dist.css': [
        'public/styles/from-sass.css',
        'node_modules/smartmenus/dist/addons/bootstrap/jquery.smartmenus.bootstrap.css'
      ]
    }
  }
};
