module.exports = {
    jasmine: {
        // src: 'lib/**/*.js', // don't think this is necessary, but try adding it in just in case
        options: {
            keepRunner: true,
            template: require('grunt-template-jasmine-nml'),
            helpers: 'spec/helpers/**/*.js',
            specs: 'spec/**/*.spec.js'
        }
    }
};
