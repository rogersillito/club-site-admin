var path = require('path');

module.exports = {
    install: {
        options: {
            // verbose: true,
            targetDir: 'public/lib',
            layout: function(type, component, source) {
                if (type == '__untyped__') {
                    return component;
                } else if (type == 'fonts') {
                    return '../fonts';
                }
                return path.join(component, type);
            },
            cleanTargetDir: true
        }
    }
};
