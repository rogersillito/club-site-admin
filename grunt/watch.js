module.exports = {
  js: {
    files: [
      'model/**/*.js',
      'routes/**/*.js',
      'lib/**/*.js',
      'public/lib/**/*.js'
    ],
    tasks: ['jshint:all', 'jasmine', 'concat:devjs']
  },
  express: {
    files: [
      'keystone.js',
      'public/js/lib/**/*.{js,json}'
    ],
    tasks: ['jshint:server', 'concurrent:dev']
  },
  css: {
    files: [
      'bower_components/smartmenus/dist/addons/bootstrap/jquery.smartmenus.bootstrap.css',
      'public/styles/**/*.scss',
      'public/lib/**/*.scss'
    ],
    tasks: ['css']
  },
  bower: {
    files: ['bower_components/**/*.*', 'bower.json'],
    tasks: ['install']
  },
  livereload: {
    files: [
      'public/styles/app.css',
    ],
    options: {
      livereload: true
    }
  }
};
