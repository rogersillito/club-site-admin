var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var addNavNodeChildBehaviours = require('../lib/navNodeChildMixin.js');
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');
var addPublishableBehaviours = require('../lib/publishableMixin.js');
var striptags = require('striptags');
var modelHelpers = require('../lib/modelHelpers');

var Page = new keystone.List('Page', {
  inherits: NavNode,

  hidden: false
});
var folder = 'pages';
var summaryLimit = 50;
Page.add({  
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true },
	summary: { type: String, watch: true, hidden: true, value: function() {
    if (!this.content) {
      return '';
    }
    var extendedText = striptags(this.content);
    return '<p>' + modelHelpers.wordLimit(extendedText, summaryLimit) + '</p>';
  } },
  image1: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image2: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image3: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  }
});
Page.schema.statics.view_name = 'page';  

addCloudinaryCleanupBehaviours(Page);
addNavNodeChildBehaviours(Page);
addPublishableBehaviours(Page, function(fields) {
  fields.publishedState.note = 'If this page has any child pages, un-publishing it will cause any child pages to be unpublished too!';
});


Page.schema.pre('save', function(next) {
  this.content = modelHelpers.cleanHtml(this.content || '');
  next();
});

Page.register();  

exports = module.exports = Page;  
