module.exports = {
    prod: {
        options: {
            preserveComments: 'all',
            compress: false,
            mangle: false
        },
        files: [{
            dest: '<%= concat.dev.dest %>',
            src: '<%= concat.dev.src %>'
        }]
    }
};
