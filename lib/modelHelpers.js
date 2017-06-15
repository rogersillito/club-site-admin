var Promise = require('es6-promise').Promise;
var _ = require('underscore');
exports = module.exports = {};

exports.documentIdsEqual = function(id1, id2) {
  return id1.toString() === id2.toString();
};

exports.publishedCriteria = function() {
  return {
    'isPublished': true
  };
};

exports.wordLimit = function (text, limit) {
  var words =  text.replace(/\s+/g,' ').trim().split(' ');
  var limited = false;
  return _.reduce(words, function(m,word,i) {
    var isLast = i === words.length-1;
    if (i >= limit) {
      return (isLast && limited) ? m + '...' : m;
    }
    if (i === limit-1)  {
      limited = true;
    }
    return m + ' ' + word;
  },'').substr(1);
};
