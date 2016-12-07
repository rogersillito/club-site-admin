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
  isPublished: { type: Boolean, label: 'Is Published?', index: true,
                 note: 'Un-publishing a system-managed page will remove it from the menu structure.' },
  relativeUrl: { type: String }
});
SystemManagedPage.schema.statics.view_name = 'page';  

SystemManagedPage.schema.statics.block_child_nodes = true;

addNavNodeChildBehaviours(SystemManagedPage);

SystemManagedPage.register();  

exports = module.exports = SystemManagedPage;  
