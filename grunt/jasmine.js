module.exports = {
    jasmine: {
        options: {
            keepRunner: true,
            template: require('grunt-template-jasmine-nml'),
            helpers: 'spec/helpers/**/*.js',
            specs: 'spec/**/*.spec.js'
        }
    }
};
