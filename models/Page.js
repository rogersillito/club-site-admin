var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var addNavNodeChildBehaviours = require('../lib/navNodeChildMixin.js');
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');

var Page = new keystone.List('Page', {
  inherits: NavNode,

  hidden: false
});
var folder = 'pages';
Page.add({  
  isPublished: { type: Boolean, label: 'Is Published?', index: true, note: 'If this page has any child pages, un-publishing it will cause any child pages to be unpublished too!' },
  publishedDate: { type: Date, default: Date.now },
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true },
  image1: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image2: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
  image3: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  }
});
addCloudinaryCleanupBehaviours(Page);
Page.schema.statics.view_name = 'page';  

addNavNodeChildBehaviours(Page);

Page.register();  

exports = module.exports = Page;  
