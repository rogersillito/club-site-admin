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

function navOrderOptions() {
  var n = 50;
  var options = '';
  for(var i = 1; i <= n; i++) {
    options += i < n ? i+',' : i;
  }
  return options;
}

NavNode.add({
  title: { type: String, required: true },
  slug: { type: String, noedit: true },
  parent: { type: Types.Relationship, ref: 'NavNode' },
  routePath: { type: String, noedit: true, hidden: true },
  navOrder: { type: Types.Select, options: navOrderOptions(), note: 'This is used when the menu is created: it overrides the alphabetical ordering of items that appear at the same menu level (lower numbers appear first).' }
});

NavNode.schema.pre('save', function(next) {
  console.log('navnode pre');
  console.log(this);;
  //TODO: un-publish children if this has been un-published!
  next();
});

NavNode.register();

exports = module.exports = NavNode;  
