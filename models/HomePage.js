var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var navigation = require('../lib/navigation.js');

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
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true },
  //TODO: is it safe to do this?
  navOrder: { type: Types.Select, options: [1], default: 1, hidden: true }
});

HomePage.schema.statics.view_name = 'home';  

HomePage.schema.pre('save', function(next) {
  this.level = 0;
  // next(new Error('You are not allowed to delete the home page!'));
  next();
});

HomePage.schema.post('save', function() {
  navigation.build();
});

HomePage.register();  
