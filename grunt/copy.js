module.exports = {
    // install non-js dependencies into public/lib
    install: {
        files: [{
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/stylesheets',
            src: ['**/*.*'],
            dest: 'public/lib/bootstrap-sass/'
        }, {
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/fonts/bootstrap',
            src: ['*.*'],
            dest: 'public/fonts/'
        }, {
            expand: true,
            cwd: 'bower_components/bootswatch/journal',
            src: ['*.scss'],
            dest: 'public/lib/bootswatch/'
        }]
    }
};
