var keystone = require('keystone');

exports = module.exports = {};

exports.build = function() {
  var q = keystone.list('NavNode').model.find().
        sort('level navOrder').
        select('_id parent routePath title isPublished __t level navOrder');
  q.exec(function(err, node){
    
    console.log("node = ", node);
    // console.log("level = ", node.level);
  });
};
