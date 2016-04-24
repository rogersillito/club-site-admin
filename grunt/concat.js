module.exports = {
    devjs: {
        options: {
            separator: ';'
        },
      dest: 'public/js/site.min.js',
      src: [
        'public/lib/_bower.js',
        'public/lib/react-router/reactRouter.js',
        'public/js/app/utils.js'
      ]
    }
};
