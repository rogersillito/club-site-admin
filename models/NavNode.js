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

var navOrderMax = 50;

function navOrderOptions() {
  var options = '';
  for(var i = 1; i <= navOrderMax; i++) {
    options += i < navOrderMax ? i+',' : i;
  }
  return options;
}

NavNode.add({
  title: { type: String, required: true },
  slug: { type: String, noedit: true },
  routePath: { type: String, noedit: true, hidden: true },
  level: { type: Number, noedit: true, hidden: true },
  navOrder: { type: Types.Select, options: navOrderOptions(),
              default: navOrderMax,
              note: 'This is used when the menu is created: it overrides the alphabetical ordering of items that appear at the same menu level (lower numbers appear first).' }
});


NavNode.register();

exports = module.exports = NavNode;  
