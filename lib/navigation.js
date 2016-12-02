var keystone = require('keystone');
var _ = require('underscore');
var documentIdsEqual = require('../lib/modelHelpers.js')
      .documentIdsEqual;

exports = module.exports = {};

var itemTempl = _.template('<%= indent %><li><a href="<%= url %>"><%= title %></a>\n\
<%= childHtml %>\
<%= indent %></li>\n');

var homeTempl = _.template('<li><a href="<%= url %>"><%= title %></a></li>\n\
<%= childHtml %>\n');

var listWrapTempl = _.template('<%= indent %><ul>\n\
<%= childHtml %>\
<%= indent %></ul>\n');

function getChildNodes(nodes, parentId, childLevel) {
  return _.filter(nodes, function(n) {
    return n.parent &&
           documentIdsEqual(n.parent, parentId) &&
           n.level === childLevel;
  });
}

function indentSpacing(level) {
  return _.reduce(_.range(level), function(memo, i) { return memo + '  '; }, '');
}

function getTemplateParams(node, childHtml) {
  var tp = _.pick(node, 'title', 'routePath');
  tp.indent = indentSpacing(node.level) + ' ';
  tp.childHtml = childHtml;
  tp.url = tp.routePath ? '/pages' + tp.routePath : '/'; // default for home page
  delete tp.routePath;
  return tp;
}

exports.build = function() {
  keystone.list('NavNode').model.find().
    sort('level navOrder').
    select('_id parent routePath title isPublished __t level navOrder').
    exec(function(err, allNodes){

      // build <ul> navigation list for child items
      function recurseHtml(childNodes, wrapInUl, currentLevel) {
        var childNodeHtml = _.reduce(childNodes, function(previousHtml, n) {
          var nextLevel = n.level + 1;
          var children = getChildNodes(allNodes, n._id, nextLevel);
          var childHtml = children.length ? recurseHtml(children, true, nextLevel) : '';
          var tParams = getTemplateParams(n, childHtml);
          return previousHtml + itemTempl(tParams);
        }, '');
        return wrapInUl ? listWrapTempl({indent: indentSpacing(currentLevel), childHtml: childNodeHtml}): childNodeHtml;
      }

      // build <ul> navigation list for root/home item
      var homeNode = _.findWhere(allNodes, {level: 0});
      var children = getChildNodes(allNodes, homeNode._id, 1);
      var tParams = getTemplateParams(homeNode, recurseHtml(children, false, 1));
      var menuHtml = homeTempl(tParams);
      console.log("menuHtml = \n", menuHtml);

      // make built navigation available to keystone
      keystone.set('navigation', {
        menu: menuHtml
      });
    });
};
