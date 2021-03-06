var keystone = require('keystone');  
var Types = keystone.Field.Types;  
var NavNode = require('./NavNode');
var addNavNodeChildBehaviours = require('../lib/navNodeChildMixin.js');

var MenuLink = new keystone.List('MenuLink', {
	defaultSort: 'title',
  inherits: NavNode,
  nocreate: false,
  nodelete: false,
  sortable: true,
  hidden: false
});
MenuLink.add({  
  isPublished: { type: Boolean, label: 'Is Published?', index: true,
                 note: 'Un-publishing a menu link will remove it from the menu structure, but the URL it refers to will still be available afterwards.' },
  relativeUrl: { type: String, note: 'The web address this menu link will navigate to.', label: 'Link URL' }
});


MenuLink.schema.statics.block_child_nodes = true;

addNavNodeChildBehaviours(MenuLink);
//TODO: use addPublishableBehaviours

MenuLink.defaultColumns = 'title|30%, routePath, navOrder, isPublished';
MenuLink.register();  

exports = module.exports = MenuLink;
