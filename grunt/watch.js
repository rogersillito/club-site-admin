module.exports = {
    js: {
        files: [
            'model/**/*.js',
            'routes/**/*.js',
            'lib/**/*.js'
        ],
        tasks: ['jshint:all', 'jasmine', 'uglify']
    },
    express: {
        files: [
            'keystone.js',
            'public/js/lib/**/*.{js,json}'
        ],
        tasks: ['jshint:server', 'concurrent:dev']
    },
    sass: {
        files: ['public/styles/**/*.scss'],
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
