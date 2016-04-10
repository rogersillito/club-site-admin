module.exports = {
    jasmine: {
        options: {
            template: require('grunt-template-jasmine-nml'),
            helpers: 'spec/helpers/**/*.js',
            specs: 'spec/**/*.spec.js'
        }
    }
};
