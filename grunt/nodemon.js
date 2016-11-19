// nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.
module.exports = {
	debug: {
		script: 'keystone.js',
		options: {
			nodeArgs: ['--debug'],
			env: {
				port: 3000
			}
		}
	}
};
