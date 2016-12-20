var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var addNavNodeChildBehaviours = require('../lib/navNodeChildMixin.js');

var MenuLink = new keystone.List('MenuLink', {
  inherits: NavNode,
  nocreate: false,
  nodelete: false,
  sortable: true,
  hidden: false
});
MenuLink.add({  
  isPublished: { type: Boolean, label: 'Is Published?', index: true,
                 note: 'Un-publishing a menu link will remove it from the menu structure, but the URL it refers to will still be available afterwards.' },
  relativeUrl: { type: String }
});

MenuLink.schema.statics.block_child_nodes = true;

addNavNodeChildBehaviours(MenuLink);

MenuLink.register();  

exports = module.exports = MenuLink;  
