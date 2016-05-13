module.exports = {
    // install non-bower js dependencies into public/lib
    install: {
        files: {
          'public/lib/react-router/reactRouter.js': 'https://npmcdn.com/react-router@2.3.0/umd/ReactRouter.js'
          // 'public/lib/history/history.js': 'https://npmcdn.com/history@2.1.1/umd/history.js'
        }
    }
};
