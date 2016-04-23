module.exports = {
    dev: {
        options: {
            beautify: true
        },
        files: {
            'public/lib/site.min.js': [
                'public/lib/_bower.js',
                'public/lib/reactRouter.js',
                'public/lib/site/utils.js'
            ]
        }
    }
};
