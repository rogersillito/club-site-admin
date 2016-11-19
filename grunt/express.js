// Simple grunt task for running an Express server that works great with LiveReload + Watch/Regarde
// https://github.com/ericclemmons/grunt-express-server#the-express-task
module.exports = {
	options: {
		port: 3000
	},
	dev: {
		options: {
			script: 'keystone.js',
			debug: true
		}
	}
};
