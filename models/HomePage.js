var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');

var adminName = 'Home Page';
var HomePage = new keystone.List('HomePage', {
  inherits: NavNode,
  nocreate: true,
  nodelete: true,
  sortable: false,
  singular: adminName,
  plural: adminName,
  hidden: false
});
HomePage.add({  
  publishedDate: { type: Date, default: Date.now },
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true }
});

//TODO: add hook to ensure can't be unpublished, and also has navOrder: 1

HomePage.schema.statics.view_name = 'home';  
HomePage.register();  
