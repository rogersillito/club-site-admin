module.exports = {
    bootstrapSass: {
        files: [{
            expand: true,
            src: ['bower_components/bootstrap-sass/assets/stylesheets/**'],
            dest: 'public/lib/bootstrap-sass/styles/'
        }]
    }
}
