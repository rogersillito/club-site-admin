// install js bower dependencies in the right order in a single file
//TODO: use pre-minified react source files for production
module.exports = {
    install: {
        dest: {
            js: 'public/lib/_bower.js'
        },
        exclude: [
            'bootstrap'
        ]
    }
};
