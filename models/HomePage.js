var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var navigation = require('../lib/navigation.js');

var HomePage = new keystone.List('HomePage', {
  inherits: NavNode,
  nocreate: true,
  nodelete: true,
  sortable: false,
  singular: 'Home Page',
  plural: 'Home Page',
  hidden: false
});
HomePage.add({  
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: true },
  navOrder: { type: Number, default: 1, noedit: true }
});

HomePage.schema.statics.view_name = 'index';

HomePage.schema.pre('save', function(next) {
  this.level = 0;
  this.routePath = '/';
  next();
});

HomePage.schema.pre('save', function(next) {
  var enforceImg = undefined;
  if (!this.bannerImage.public_id) {
    enforceImg = new Error('You must set a banner image for the home page.');
  }
  next(enforceImg);
});

HomePage.schema.post('save', function() {
  navigation.build();
});

HomePage.register();  
