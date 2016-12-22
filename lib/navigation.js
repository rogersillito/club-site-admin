var keystone = require('keystone');
var _ = require('underscore');
var documentIdsEqual = require('../lib/modelHelpers.js')
  .documentIdsEqual;

exports = module.exports = {};

var itemTempl = _.template('<%= indent %><li><a href="<%= url %>"><%= title %><%= caret %></a>\n\
<%= childHtml %>\
<%= indent %></li>\n');

var homeTempl = _.template('<li><a href="<%= url %>"><%= title %></a></li>\n\
<%= childHtml %>\n');

var listWrapTempl = _.template('<%= indent %><ul class="dropdown-menu">\n\
<%= childHtml %>\
<%= indent %></ul>\n');

function getChildNodes(nodes, parentId, childLevel) {
  return _.filter(nodes, function(n) {
    return n.parent &&
           documentIdsEqual(n.parent, parentId) &&
           n.level === childLevel &&
           (typeof(n.isPublished) === 'undefined' || n.isPublished === true);
  });
}

function indentSpacing(level) {
  return _.reduce(_.range(level), function(memo, i) { return memo + '  '; }, '');
}

function getTemplateParams(node, childHtml) {
  var tp = _.pick(node, 'title', 'routePath', 'relativeUrl');
  tp.indent = indentSpacing(node.level) + ' ';
  tp.childHtml = childHtml;
  tp.caret = tp.childHtml ? '<span class="caret"></span>' : '';
  tp.url = tp.routePath ? '/pages' + tp.routePath : '/'; // default for home page
  if (tp.relativeUrl) {
    tp.url = tp.relativeUrl;
  }
  delete tp.routePath;
  return tp;
}

exports.build = function() {
  // console.log('Starting navigation build...');
  keystone.list('NavNode').model.find().
    sort('level navOrder title').
    select('_id parent routePath title isPublished __t level navOrder relativeUrl').
    exec(function(err, allNodes){

      // build <ul> navigation list for child items
      function recurseHtml(childNodes, currentLevel) {
        var childNodeHtml = _.reduce(childNodes, function(previousHtml, n) {
          var nextLevel = n.level + 1;
          var children = getChildNodes(allNodes, n._id, nextLevel);
          var childHtml = children.length ? recurseHtml(children, nextLevel) : '';
          var tParams = getTemplateParams(n, childHtml);
          return previousHtml + itemTempl(tParams);
        }, '');
        return currentLevel > 1 ? listWrapTempl({indent: indentSpacing(currentLevel), childHtml: childNodeHtml}): childNodeHtml;
      }

      // build <ul> navigation list for root/home item
      var menuHtml = '';
      var homeNode = _.findWhere(allNodes, {level: 0, __t: 'HomePage'});
      if (homeNode) {
        var children = getChildNodes(allNodes, homeNode._id, 1);
        var tParams = getTemplateParams(homeNode, recurseHtml(children, 1));
        menuHtml = homeTempl(tParams);
      }

      // make built navigation available to keystone
      keystone.set('navigation', {
        menu: menuHtml
      });
      console.log('navigation rebuilt!');
      // console.log('navigation built:\n', menuHtml);
    });
};
