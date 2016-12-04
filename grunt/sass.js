// Compile Sass to CSS using node-sass
// https://github.com/sindresorhus/grunt-sass#usage
module.exports = {
	dist: {
    options: {
      style: 'expanded'
    },
    files: {
      'public/styles/from-sass.css': 'public/styles/app.scss'
    }
  }
};
