var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var NavNode = require('../models/NavNode.js');
var Promise = require('es6-promise')
      .Promise;

var addNavNodeChildBehaviours = function(ListDefinition) {
  // console.log("ListDefinition = ", ListDefinition);

  ListDefinition.add({
    parent: { type: Types.Relationship, ref: 'NavNode', label:'Menu Parent' }
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

  ListDefinition.schema.methods.isSameAs = function(navNode) {
    return this.id.toString() === navNode.id.toString();
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
        NavNode.model.findOne({_id: current.parent}).exec(function(err, parentNode) {
          if (err) {
            reject(err);
          }
          nodes.push(parentNode);
          recurse(nodes);
        });
      };
      recurse([startNode]);
    });
  };

  ListDefinition.schema.methods.getChildNodes = function() {
  };


  // console.log("ListDefinition.schema = ", ListDefinition.schema);


  // ENFORCE HIERARCHY RULES
  ListDefinition.schema.pre('save', function(next) {
    if (isVersioned(this) && !this.parent) {
      next(createErr('You must select a menu parent before saving.'));
    }
    next();
  });

  ListDefinition.schema.pre('save', function(next) {
    // TODO: if has been unpublished - unpublish children:
    // TODO: if slug has changed - update child routePath values:
    // console.log(this.modifiedPaths());

    this.getNodesToRoot().then(function(nodes) {
      // console.log("nodes = ", nodes);
      var saveNode = nodes[0];

      if (nodes.length == 1) {
        next(); // we are saving root - no need to enforce parent rules
      }

      //TODO: check grandparents and beyond, not just direct parent
      if (saveNode.isSameAs(nodes[1])) {
        next(createErr('You cannot select an item as its own menu parent - please make a different selection.'));
      }
      next();

    }).catch(next);
  });

  // ListDefinition.schema.post('save', function(navNode) {
  //   console.log('navnode post');
  //   console.log(navNode);
  // });
};

exports = module.exports = addNavNodeChildBehaviours;  
