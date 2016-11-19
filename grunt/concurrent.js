// Running slow tasks like Coffee and Sass concurrently can potentially improve your build time significantly. This task is also useful if you need to run multiple blocking tasks like nodemon and watch at once.
// https://github.com/sindresorhus/grunt-concurrent

module.exports = {
	dev: {
		tasks: ['nodemon', 'node-inspector', 'watch'], // i.e. all 3 run concurrently
		options: {
			logConcurrentOutput: true
		}
	}
};
