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

// as our plan of attack is to only fetch cloudinary images where there are pre-existing incoming transformations applied
// this helper function gives us an image url based on a named transform
exports.getCloudinarySrc = function (cloudinarySrcFunc, namedTransformation, options) {
  if (typeof(cloudinarySrcFunc) !== 'function') {
    throw new Error('getCloudinarySrc() expects as first param a cloudinary "src" function callback');
  }
  if (typeof(options) !== 'object') {
    options = {};
  }
  if (typeof(namedTransformation) == 'string' && namedTransformation) {
    options.transformation = namedTransformation;
  }
  const src = cloudinarySrcFunc(options);
  // console.log("Cloudinary src = ", src);

  // keystone adds auto format - which isn't specified in our named transform (-> and breaks 'strict' setting made in Cloudinary!)
  return src.replace(/f_auto,?/, '');
};
