module.exports = {
	options: {
		reporter: require('jshint-stylish'),
		force: true
	},
	all: [ 'routes/**/*.js',
				 'spec/**/*.js',
				 'models/**/*.js'
	],
	server: [
		'./keystone.js'
	]
};
