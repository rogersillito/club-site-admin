module.exports = {
    dev: {
        options: {
            preserveComments: 'all',
            compress: false,
            mangle: false
        },
        files: [{
            dest: 'public/js/site.min.js',
            src: [
                'public/lib/_bower.js',
                'public/lib/react-router/reactRouter.js',
                'public/js/app/utils.js'
            ]
        }]
    }
};
