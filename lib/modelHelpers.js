const Promise = require('es6-promise').Promise;
const _ = require('underscore');
const sanitizeHtml = require('sanitize-html');
const cheerio = require('cheerio');

exports = module.exports = {};

exports.documentIdsEqual = function(id1, id2) {
  return id1.toString() === id2.toString();
};

exports.publishedCriteria = function() {
  return {
    'isPublished': true
  };
};

function setOuterTableTags($el, $) {
  var children = $el.children;
  if (typeof($el.children) === 'function') {
    children = $el.children();
  }
  if (typeof($el.children) === 'undefined') {
    return;
  }
  for(var i = 0; i < children.length; i++) {
    if (children[i].tagName === 'table') {
      $(children[i]).addClass('table table-striped');
    }
    else
    {
      setOuterTableTags(children[i], $);
    }
  }
}

exports.cleanHtml = function(html, optCustomize) {
  var config = {
    allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                   'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                   'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
    allowedAttributes: {
      td: ['colspan', 'rowspan'],
      a: [ 'href', 'name', 'target' ],
      img: ['src']
    },
    // Lots of these won't come up by default because we don't allow them 
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
    // URL schemes we permit 
    allowedSchemes: [ 'http', 'https', 'mailto' ],
    allowedSchemesByTag: {},
    allowProtocolRelative: true
  };
  if (typeof(optCustomize) === 'function') {
    optCustomize(config);
  }
  html = sanitizeHtml(html, config);

  const tempWrapped = '<div id="root-node">'+html+'</div>';
  const $ = cheerio.load(tempWrapped);
  setOuterTableTags($('#root-node'), $);
  return $('#root-node').html();
};

exports.fixMeetingResultHtml = function(html) {
  const customizer = opt => {
    opt.allowedTags = _.reject(opt.allowedTags, x => x === 'h3');
  };
  return exports.cleanHtml(html, customizer);
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

exports.getLightboxSrcs = function (doc, cloudinaryImgProperty) {
	if (!doc[cloudinaryImgProperty].url) {
		return undefined;
	}
	const srcFunc = doc._[cloudinaryImgProperty].src;
	const result = {
		large: doc[cloudinaryImgProperty].url,
		thumbnail: exports.getCloudinarySrc(srcFunc, "lfrc_thumbnail")
	};
	return result;
};
