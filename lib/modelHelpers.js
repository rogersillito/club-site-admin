var Promise = require('es6-promise').Promise;
exports = module.exports = {};

exports.documentIdsEqual = function(id1, id2) {
  return id1.toString() === id2.toString();
};

exports.publishedCriteria = function() {
  return {
    'isPublished': true
  };
};
