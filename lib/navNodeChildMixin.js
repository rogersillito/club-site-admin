var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var documentIdsEqual = require('../lib/modelHelpers.js')
  .documentIdsEqual;
var NavNode = require('../models/NavNode.js');
var Promise = require('es6-promise')
  .Promise;
var navigation = require('../lib/navigation.js');

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

  ListDefinition.schema.post('init', function() {
    this._originalSlug = this.toObject().slug;
  });

  function getRoutePath(pathFromRoot) {
    var pathExcludingHome = pathFromRoot.slice(1, pathFromRoot.length);
    var rp = _.reduce(pathExcludingHome, function(memo,v,i,list) {
      return memo + v.slug + "/";
    }, "/");
    return rp.substring(0, rp.length - 1);
  }

  ListDefinition.schema.pre('save', function(next) {
    if (isVersioned(this) && !this.parent) {
      next(createErr('You must select a menu parent before saving.'));
    }
    next();
  });

  var saveNode;
  var descendentNodes;
  function setSaveNodeAndDescendents(next) {
    saveNode = this;
    this.getAllDescendentNodes()
      .then(function(ns) {
        descendentNodes = ns;
        next();
      }).catch(next);
  }
  ListDefinition.schema.pre('save', setSaveNodeAndDescendents);

  var pathFromRoot;
  ListDefinition.schema.pre('save', function(next) {
    this.getNodesToRoot()
      .then(function(results) {
        results.reverse();
        pathFromRoot = results;
        next();
      }).catch(next);
  });

  // ENFORCE HIERARCHY RULES
  ListDefinition.schema.pre('save', function(next) {
    if (!saveNode.parentChanged()) {
      next();
      return;
    }

    var parentNode = pathFromRoot[pathFromRoot.length -2];
    if (parentNode.constructor.block_child_nodes) {
      next(createErr(
        'You cannot select an item of this type to be a menu parent - please make a different selection.'
      ));
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
    next();
  });

  // SET ROUTE PATH/LEVEL
  ListDefinition.schema.pre('save', function(next) {
    if (!this.parent) {
      next();
      return;
    }
    saveNode.routePath = getRoutePath(pathFromRoot);
    saveNode.level = saveNode.routePath.match(/\//g).length;
    next();
  });

  // CHANGE DESCENDENTS:
  // IF HAS BEEN UNPUBLISHED - ENSURE ALL DESCENDENTS ARE UNPUBLISHED
  // IF SLUG HAS CHANGED - UPDATE ALL DESCENDENT ROUTEPATH VALUES
  function hasBeenUnpublished(navNode) {
    var published = navNode.isPublished;
    return typeof(published) !== 'undefined' &&
      !published &&
      _.contains(navNode.modifiedPaths(), 'isPublished');
  }

  function getUpdatedRoutePath(navNode) {
    var pathFind = '/' + saveNode._originalSlug + '/';
    var pathReplace = '/' + saveNode.slug + '/';
    return navNode.routePath.replace(pathFind, pathReplace);
  }

  ListDefinition.schema.pre('save', function(next) {
    var slugChanged = _.contains(this.modifiedPaths(), 'slug');
    var isUnpublished = hasBeenUnpublished(saveNode);
    if (slugChanged || isUnpublished) {
      var saveCount = 0;
      _.each(descendentNodes, function(descendent) {
        if (isUnpublished) {
          descendent.isPublished = false;
        }
        if (slugChanged) {
          descendent.routePath = getUpdatedRoutePath(descendent);
        }
        descendent.save(function(err) {
          if (err) {
            next(err);
            return;
          }
          saveCount++;
          if (saveCount === descendentNodes.length) {
            next();
          }
        });
      });
    }
    next();
  });

  ListDefinition.schema.post('save', function() {
    navigation.build();
  });

  // deletion behaviours
  ListDefinition.schema.pre('remove', setSaveNodeAndDescendents);

  ListDefinition.schema.pre('remove', function(next) {
    if (descendentNodes.length) {
      next(new Error('You cannot delete an item that has child items - first delete the child items if you want to delete this.'));
      return;
    }
    next();
  });

  ListDefinition.schema.post('remove', function() {
    navigation.build();
  });
};

exports = module.exports = addNavNodeChildBehaviours;
