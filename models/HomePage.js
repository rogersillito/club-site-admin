var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var navigation = require('../lib/navigation.js');
var modelHelpers = require('../lib/modelHelpers');

var HomePage = new keystone.List('HomePage', {
  inherits: NavNode,
  nocreate: true,
  nodelete: true,
  sortable: false,
  singular: 'Home Page',
  plural: 'Home Page',
  hidden: false
});

function numericOptions(max) {
  var options = '';
  for(var i = 1; i <= max; i++) {
    options += i < max ? i+',' : i;
  }
  return options;
}

var wysiwygOptions = modelHelpers.wysiwygMainContentSettings();

HomePage.add({  
  metaDescription: { type: String },
  content: { type: Types.Html, wysiwyg: wysiwygOptions },
  ResultsToShow: { type: Types.Select, options: numericOptions(20),
									 default: 6, note: 'Sets the number of items to list under "Latest Results"' },
  UpdatesToShow: { type: Types.Select, options: numericOptions(20),
									 default: 4, note: 'Sets the number of items to list under "What\'s New?"' },
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

HomePage.schema.pre('save', function(next) {
  this.content = modelHelpers.cleanHtml(this.content || '');
  next();
});

HomePage.schema.post('save', function() {
  navigation.build();
});

HomePage.register();  
