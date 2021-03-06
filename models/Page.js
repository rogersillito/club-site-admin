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
	defaultSort: '-publishedDate',
  hidden: false
});
var folder = 'pages';
var summaryLimit = 50;
var wysiwygOptions = modelHelpers.wysiwygMainContentSettings();
Page.add({  
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: wysiwygOptions },
	summary: { type: String, watch: true, hidden: true, value: function() {
    if (!this.content) {
      return '';
    }
    var extendedText = striptags(this.content);
    return '<p>' + modelHelpers.wordLimit(extendedText, summaryLimit) + '</p>';
  } },
  subContentHtml: { type: Types.Textarea, height: 300,
										label: 'HTML Sub-Content',
										note: 'Displayed immediately below the main content section: NB: edit with caution, AVOID PASTING FROM WORD - the HTML in this field does not get cleaned up!' },
  image1: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image2: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image3: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
	files:  { type: Types.Relationship, ref: 'FileUpload', many: true }
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

Page.defaultColumns = 'title|30%, routePath, navOrder, publishedState, publishedDate';
Page.register();  

exports = module.exports = Page;  
