var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var documentIdsEqual = require('../lib/modelHelpers.js')
  .documentIdsEqual;
var NavNode = require('../models/NavNode.js');
var Promise = require('es6-promise')
  .Promise;

var addNavNodeChildBehaviours = function(ListDefinition) {

  ListDefinition.add({
    parent: {
      type: Types.Relationship,
      ref: 'NavNode',
      label: 'Menu Parent'
    }
  });

  var isVersioned = function(navNode) {
    // use this to distinguish a save following user editing
    // from the save that takes place when the admin UI
    // initially asks for the object name
    return navNode.__v === 0 || navNode.__v;
  };

  var createErr = function(msg) {
    return new Error(msg);
  };

  ListDefinition.schema.methods.getNodesToRoot = function() {
    var startNode = this;
    return new Promise(function(resolve, reject) {
      var recurse = function(nodes) {
        var current = _.last(nodes);
        if (!current.parent) {
          resolve(nodes); // current == root!
          return;
        }
        NavNode.model.findOne({
            _id: current.parent
          })
          .exec(function(err, parentNode) {
            if (err) {
              reject(err);
              return;
            }
            nodes.push(parentNode);
            recurse(nodes);
          });
      };
      recurse([startNode]);
    });
  };

  ListDefinition.schema.methods.parentChanged = function() {
    return _.contains(this.modifiedPaths(), 'parent');
  };

  ListDefinition.schema.methods.getAllDescendentNodes = function() {
    var recurse = function(parent) {
      return new Promise(function(resolve, reject) {
        NavNode.model.find({
            parent: parent._id
          })
          .exec(function(err, children) {
            if (err) {
              reject(err);
              return;
            }
            var childPromises = [];
            var outNodes = [];
            _.each(children, function(child) {
              outNodes.push(child);
              childPromises.push(recurse(child));
            });
            Promise.all(childPromises)
              .then(function(grandchildren) {
                _.each(grandchildren, function(grandchild) {
                  outNodes = outNodes.concat(grandchild);
                });
                resolve(outNodes);
              });
          });
      });

    };
    return recurse(this);
  };

  function getRoutePath(pathFromRoot) {
    var rp = _.reduce(pathFromRoot, function(memo,v,i,list) {
      return memo + v.slug + "/";
    }, "/");
    return rp.substring(0, rp.length - 1);
  }

  // ENFORCE HIERARCHY RULES & SET ROUTE PATH
  ListDefinition.schema.pre('save', function(next) {
    if (isVersioned(this) && !this.parent) {
      next(createErr('You must select a menu parent before saving.'));
    }
    next();
  });

  var saveNode;
  var descendentNodes;
  ListDefinition.schema.pre('save', function(next) {
    saveNode = this;
    this.getAllDescendentNodes()
      .then(function(ns) {
        descendentNodes = ns;
        next();
      }).catch(next);
  });

  ListDefinition.schema.pre('save', function(next) {
    if (!saveNode.parentChanged()) {
      next();
      return;
    }

    if (documentIdsEqual(saveNode.parent, saveNode.id)) {
      next(createErr(
        'You cannot select an item as its own menu parent - please make a different selection.'
      ));
      return;
    }

    if (_.find(descendentNodes, function(n) { return documentIdsEqual(saveNode.parent, n.id); })) {
      next(createErr(
        'You cannot select a child/descendent item as menu parent - please make a different selection.'
      ));
      return;
    }

    this.getNodesToRoot()
      .then(function(results) {
        results.reverse();
        var pathFromRoot = results;
        saveNode.routePath = getRoutePath(pathFromRoot);
        next();
      })
      .catch(next);
  });

  // CHANGE DESCENDENT PUBLISHED STATES IF NEEDED
  function hasBeenUnpublished(navNode) {
    var published = navNode.isPublished;
    return typeof(published) !== 'undefined' &&
      !published &&
      _.contains(navNode.modifiedPaths(), 'isPublished');
  }

  ListDefinition.schema.pre('save', function(next) {
    if (hasBeenUnpublished(saveNode)) {
      var saveCount = 0;
      var toUnpublish = _.filter(descendentNodes, function(n) { return n.isPublished; });
      _.each(toUnpublish, function(descendent) {
        descendent.isPublished = false;
        descendent.save(function(err) {
          if (err) {
            next(err);
            return;
          }
          saveCount++;
          if (saveCount === toUnpublish.length) {
            next();
            return;
          }
        });
      });
    }
    next();
  });

  // TODO: if slug has changed - update child routePath values:
  //   var slugChanged = _.contains(this.modifiedPaths(), 'slug');
};

exports = module.exports = addNavNodeChildBehaviours;
