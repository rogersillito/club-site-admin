var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var Promise = require('es6-promise')
  .Promise;
var cloudinary = require('cloudinary');


var addCloudinaryCleanupBehaviours = function(ListDefinition) {

  // function pp(obj)
  // {
  //   return JSON.stringify(obj,null,2);
  // }

  var Cleaner = function() {
    var public_ids = [];
    this.addId = function(public_id) {
      public_ids.push(public_id);
    };
    this.removeAll = function() {
      if (public_ids.length) {
        cloudinary.api.delete_resources(public_ids, function(result) {
          console.log("Cleaned up " + public_ids.length, " Cloudinary uploads: " + _.keys(result.deleted));
        });
      }
    };
  };

  function hasCloudinaryImage(field) {
    return typeof field === 'object'
           && field.url
           && typeof(field.url) === 'string'
           && field.url.indexOf('cloudinary.com') !== -1;
  }

  ListDefinition.schema.post('remove', function(doc) {
    var cleaner = new Cleaner();
    for(var fieldName in doc) {
      var field = doc[fieldName]; 
      if (hasCloudinaryImage(field)) {
        // CloudinaryImage
        cleaner.addId(field.public_id);
        continue;
      }
      if (_.isArray(field)) {
        for(var i = 0; i < field.length; i++) {
          // CloudinaryImages
          if (hasCloudinaryImage(field[i])) {
            cleaner.addId(field[i].public_id);
          }
        }
      }
    }
    cleaner.removeAll();
  });
};

exports = module.exports = addCloudinaryCleanupBehaviours;