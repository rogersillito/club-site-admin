var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var Promise = require('es6-promise')
      .Promise;
var modelHelpers = require('./modelHelpers');
var dateHelpers = require('./dateHelpers');

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
															 label: 'Date/Time First Published' },
    resetPublisehd: { type: Boolean, label: 'Reset Date/Time First Published',
											dependsOn: { publishedState: 'published' },
											note: 'Tick here to make the date published reset to the current date - will push the item back up the \"what\'s new?\" homepage list.'}
  };
  if (typeof(customize) === 'function') {
    customize(fieldSpec);
  }
  ListDefinition.add(fieldSpec);

  ListDefinition.schema.pre('save', function(next) {
		// reset date published
    if (this.resetPublisehd) {
			this.resetPublisehd = undefined;
			if (this.isPublished) {
				this.publishedDate = Date.now();
			}
		}
    // set published date when first becomes published
    if (this.isPublished && typeof(this.publishedDate) === 'undefined') {
      this.publishedDate = Date.now();
    }
    // set published date strings as long as there is a published date
    if (typeof(this.publishedDate) !== 'undefined') {
      this.publishedDateString = this._.publishedDate.format(dateHelpers.formatStrings.dayDateString);
      this.publishedDateTimeString = this._.publishedDate.format(dateHelpers.formatStrings.dayDateTimeString);
    }
    return next();
  });

  ListDefinition.schema.statics.getLatestPublished = function(n, projections, populate) {
    var criteria = modelHelpers.publishedCriteria();
    return new Promise(function(resolve, reject) {
      var q = ListDefinition.model.find(criteria, projections)
        .limit(n || 10)
        .populate(populate || '')
        .sort('-publishedDate')
        .exec(function(err, results) {
          if (err) {
            reject(err);
          }
          resolve(results);
        });
    });
  };
};

exports = module.exports = addPublishableBehaviours;
