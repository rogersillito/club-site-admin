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
    allowedTags: [ 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
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

exports.transformFileUploads = filesField => {
	const files = [];
	filesField.forEach(f => {
		if (f.file && f.file.url) {
			files.push({
				name: f.name,
				uploadDate: f.uploadDate,
				url: f.downloadUrl,
				iconClass: f.getIconClass()
			});
		}
	});
  return files;
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

const thumbTransform = "lfrc_thumbnail";
exports.getLightboxSrcs = function (doc, cloudinaryImgProperty) {
	if (!doc[cloudinaryImgProperty].url) {
		return undefined;
	}
	const srcFunc = doc._[cloudinaryImgProperty].src;
	const result = {
		large: doc[cloudinaryImgProperty].url,
		thumbnail: exports.getCloudinarySrc(srcFunc, thumbTransform)
	};
	return result;
};

exports.getManyLightboxSrcs = function (doc, cloudinaryImagesProperty) {
	const results = [];
	if (!doc[cloudinaryImagesProperty].length) {
		return results;
	}
	doc[cloudinaryImagesProperty].forEach(im => {
		results.push({
			large: im.url,
			thumbnail: exports.getCloudinarySrc(im.src.bind(im), thumbTransform)
		});
	});
	return results;
};

exports.wysiwygMainContentSettings = () => {
	const opt = {
    additionalPlugins: 'table',
		additionalOptions: {
			content_css: '/styles/wysiwyg.css', // see "/grunt/cssmin.js"
			toolbar: 'formatselect blockquote | undo redo | bold italic strikethrough | bullist numlist | link unlink hr | table',
			block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre',
      table_toolbar: "tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
      table_appearance_options: false,
      table_advtab: false,
      table_cell_advtab: false,
      table_row_advtab: false
		}
	};
	return opt;
};
