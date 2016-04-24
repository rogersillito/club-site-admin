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
    sass: {
      files: ['public/styles/**/*.scss','public/lib/**/*.scss'],
        tasks: ['sass']
    },
    bower: {
        files: ['bower_components/**/*.*', 'bower.json'],
        tasks: ['install']
    },
    livereload: {
        files: [
            'public/styles/**/*.css',
        ],
        options: {
            livereload: true
        }
    }
};
