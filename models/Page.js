var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');

var Page = new keystone.List('Page', {
  inherits: NavNode,
  hidden: false
});
Page.add({  
  publishedDate: { type: Date, default: Date.now },
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true }
});
Page.schema.statics.view_name = 'generic_page';  
Page.register();  
