// Minify CSS
// https://github.com/gruntjs/grunt-contrib-cssmin#cssmin-task
// https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
module.exports = {
  options: {
    shorthandCompacting: false,
    // sourceMap: true,
    // keepBreaks: true,
    roundingPrecision: -1
  },
  dist: {
    files: {
      'public/styles/dist.css': [
        'public/styles/from-sass.css',
        'bower_components/smartmenus/dist/addons/bootstrap/jquery.smartmenus.bootstrap.css'
      ]
    }
  }
};
