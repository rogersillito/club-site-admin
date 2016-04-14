var jsFiles = [
    'model/**/*.js',
    'routes/**/*.js',
    'lib/**/*.js'
];

module.exports = {
    js: {
        files: jsFiles,
        tasks: ['jshint:all', 'jasmine']
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
        tasks: ['bower']
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
