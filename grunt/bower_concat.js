module.exports = {
    // install js bower dependencies in the right order in a single file
    //TODO: use pre-minified react source files for production
    install: {
        dest: {
            js: 'public/lib/_bower.js'
        },
        mainFiles: {
          'smartmenus': ['dist/jquery.smartmenus.js', 'dist/addons/bootstrap/jquery.smartmenus.bootstrap.js']
        },
        exclude: [
            'bootstrap'
        ]
    }
};
