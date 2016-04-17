module.exports = {
    dev: {
        dest: 'public',
        js_dest: 'public/js',
        images_dest: 'public/images',
        fonts_dest: 'public/fonts',
        css_dest: 'public/styles',
        options: {
            packageSpecific: {
                'bootstrap-sass': {
                    fonts_dest: 'public/fonts',
                    css_dest: 'public/styles',
                    js_dest: 'public/js'//,
                    // files: [
                    //     'assets/**/*.*'
                    // ]
                }
            },
            process: function(content, srcpath) {
                // console.log('content: ', content);
                console.log('srcpath: ', srcpath);
                return content;
            }
        }

    }
};
