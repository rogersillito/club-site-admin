var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var addNavNodeChildBehaviours = require('../lib/navNodeChildMixin.js');

var SystemManagedPage = new keystone.List('SystemManagedPage', {
  inherits: NavNode,
  nocreate: true,
  nodelete: true,
  sortable: false,
  hidden: false
});
SystemManagedPage.add({  
  isPublished: { type: Boolean, label: 'Is Published?', index: true, note: 'If this page has any child pages, un-publishing it will cause any child pages to be unpublished too!' },
  publishedDate: { type: Date, default: Date.now },
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true }
});
SystemManagedPage.schema.statics.view_name = 'page';  

addNavNodeChildBehaviours(SystemManagedPage);

SystemManagedPage.register();  

exports = module.exports = SystemManagedPage;  
