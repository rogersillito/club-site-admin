module.exports = {
    dev: {
        options: {
            beautify: true
        },
        files: {
            'public/js/site.min.js': [
                'public/js/dist/jquery.js',
                'public/js/react.js',
                'public/js/react-dom.js',
                'public/js/browser.js',
                'public/js/lib/sammy.js',
                'public/js/site/utils.js'
            ]
        }
    }
};
