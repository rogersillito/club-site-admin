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

	function getAssociatedCloudinaryPublicIds(doc) {
		const publicIds = [];
    for(var fieldName in doc) {
      var field = doc[fieldName]; 
      if (hasCloudinaryImage(field)) {
        // CloudinaryImage
        publicIds.push(field.public_id);
        continue;
      }
      if (_.isArray(field)) {
        for(var i = 0; i < field.length; i++) {
          // CloudinaryImages
          if (hasCloudinaryImage(field[i])) {
            publicIds.push(field[i].public_id);
          }
        }
      }
    }
		return publicIds;
	}

	// cleanup when doc saved - in case keystone doesn't do cleanup!
  ListDefinition.schema.post('init', function(doc) {
		doc.publicIdsWhenLoaded = [];
		getAssociatedCloudinaryPublicIds(doc).forEach(public_id => {
			doc.publicIdsWhenLoaded.push(public_id);
		});
	});
  ListDefinition.schema.post('save', function(doc) {
		var removedIds = doc.publicIdsWhenLoaded || [];
		if (!removedIds.length) {
			// we didn't have any files initially so nothing to do here!
			return;
		}
		var postSaveIds = getAssociatedCloudinaryPublicIds(doc);
		postSaveIds.forEach(public_id => {
			removedIds = _.reject(removedIds, initial_pid => initial_pid === public_id);
		});
		if (removedIds.length) {
			var cleaner = new Cleaner();
			removedIds.forEach(public_id => cleaner.addId(public_id));
			cleaner.removeAll();
			// console.log("publicIds missing = ", removedIds);
		}
	});

	// cleanup when doc removed
  ListDefinition.schema.post('remove', function(doc) {
    var cleaner = new Cleaner();
		getAssociatedCloudinaryPublicIds(doc).forEach(public_id => {
      cleaner.addId(public_id);
		});
    cleaner.removeAll();
  });
};

exports = module.exports = addCloudinaryCleanupBehaviours;
