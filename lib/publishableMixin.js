var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var Promise = require('es6-promise')
      .Promise;
var modelHelpers = require('./modelHelpers');

var addPublishableBehaviours = function(ListDefinition, customize) {

  var fieldSpec = {
	  publishedState: { type: Types.Select,
                      options: 'draft, published, archived',
                      default: 'draft' },
	  publishedDate: { type: Types.Datetime, hidden: true, index: true },
    isPublished: { type: Boolean, hidden: true,
                   index: true, watch: true,
                   value: function() {
                     return this.publishedState === 'published';
                   } },
    publishedDateString: { type: String, hidden: true },
    publishedDateTimeString: { type: String, noedit: true,
                           label: 'Date/Time First Published' }
  };
  if (typeof(customize) === 'function') {
    customize(fieldSpec);
  }
  ListDefinition.add(fieldSpec);

  ListDefinition.schema.pre('save', function(next) {
    // set published date when first becomes published
    if (this.isPublished && typeof(this.publishedDate) === 'undefined') {
      this.publishedDate = Date.now();
    }
    // set published date strings as long as there is a published date
    if (typeof(this.publishedDate) !== 'undefined') {
      this.publishedDateString = this._.publishedDate.format('dddd Do MMMM YYYY');
      this.publishedDateTimeString = this._.publishedDate.format('dddd Do MMMM YYYY, h:mma');
    }
    return next();
  });

  ListDefinition.schema.statics.getLatestPublished = function(n, projections) {
    var criteria = modelHelpers.publishedCriteria();
    return new Promise(function(resolve, reject) {
      var q = ListDefinition.model.find(criteria, projections)
        .limit(n || 10)
        .sort('-publishedDate')
        .exec(function(err, results) {
          if (err) {
            reject(err);
          }
          resolve(results);
        });
      console.log("projections = ", projections);
    });
  };
};

exports = module.exports = addPublishableBehaviours;
