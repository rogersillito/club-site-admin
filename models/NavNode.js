var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * NavNode Model
 * ==========
 */

var NavNode = new keystone.List('NavNode', {
  map: { name: 'title' },
  hidden: true, // admins don't see these
  autokey: { path: 'slug', from: 'title', unique: true } // fixed: true ??? do we want these changing?  Will be a P.I.T.A. to keep synced if so
});

NavNode.add({
  title: { type: String, required: true },
  slug: { type: String, readonly: true },
  parent: { type: Types.Relationship, ref: 'NavNode' },
  isPublished: { type: Boolean, label: 'Is Published?', index: true, note: 'TODO: Unpublishing this item will cause any child items to be unpublished too!' },
  routePath: { type: String, readonly: true, hidden: true },
  navOrder: { type: Types.Select, options: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10'}
});

NavNode.register();

exports = module.exports = NavNode;  
