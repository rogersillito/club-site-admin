var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var Promise = require('es6-promise')
      .Promise;
var modelHelpers = require('./modelHelpers');

var addPublishableBehaviours = function(ListDefinition) {

  ListDefinition.add({
    isPublished: { type: Boolean, label: 'Is Published?', index: true },
	  publishedDate: { type: Types.Datetime, hidden: true, label: 'Date First Published', index: true },
    publishedDateString: { type: String, noedit: true, watch: 'publishedDate', value: function() {
      return this._.publishedDate.format('dddd Do MMMM YYYY, h:mma');
    } }
  });

  ListDefinition.schema.pre('save', function(next) {
    console.log("BEFORE this.isPublished = ", this.isPublished);
    console.log("BEFORE this.publishedDate = ", this.publishedDate);
    //TODO:this isn't working!
    if (this.isPublished && typeof(this.publishedDate) == 'undefined') {
      // set a published date!
      this.publishedDate = Date.now;
    }
    console.log("this.publishedDate = ", this.publishedDate);
    return next();
  });

  //TODO: add something like this as a 
  // ListDefinition.schema.methods.getLatestPublished = function(model, n) {
  //   var criteria = modelHelpers.publishedCriteria();

  //   return new Promise(function(resolve, reject) {
  //     var q = model.find(criteria)
  //           .lean()
  //           .sort('-publishedDate');
  //     q.exec(function(err, results) {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(results);
  //     });
  //   });
  // };

};

exports = module.exports = addPublishableBehaviours;
