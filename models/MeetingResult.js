var keystone = require('keystone');
var Types = keystone.Field.Types;
var utils = require('../lib/utils');
var moment = require('moment');
var addPublishableBehaviours = require('../lib/publishableMixin.js');
var modelHelpers = require('../lib/modelHelpers');

/**
 * MeetingResult Model
 * =============
 */

var MeetingResult = new keystone.List('MeetingResult', {
    autokey: { from: 'nameOrLocation date', path: 'key', unique: true },
		defaultSort: '-date',
    map: { name: 'nameOrLocation'}
});
var wysiwygOptions = modelHelpers.wysiwygMainContentSettings();
wysiwygOptions.additionalOptions.block_formats = 'Paragraph=p;Heading 4=h4;Heading 5=h5;Heading 6=h6;Preformatted=pre';

MeetingResult.add({
    nameOrLocation: { type: String, required: true, initial: true },
    date: { type: Types.Date, default: Date.now(), required: true, index: true },
    // the generated month & year fields permit easier retrieval in queries
    month: { type: Number, watch: true, value: function() {
        return moment(this.date).month()+1;
    }, hidden: true, index: true },
    year: { type: Number, watch: true, value: function() {
        return moment(this.date).year();
    }, hidden: true, index: true },
    resultUrl: { type: Types.Url, label: 'Full Results URL' },
    resultLinkText: { type: String, watch: true, value: function() {
      return this._.resultUrl.format();
    }, hidden: true },
		resultHtml: {
			type: Types.Html, wysiwyg: wysiwygOptions
		}
});

addPublishableBehaviours(MeetingResult);

MeetingResult.schema.pre('save', function(next) {
  this.resultHtml = modelHelpers.fixMeetingResultHtml(this.resultHtml || '');
  next();
});

// MeetingResult.schema.virtual('dumpMe').get(function() {
//     return this;
// });
MeetingResult.schema.set('toJSON', {
    virtuals: true
});

MeetingResult.defaultColumns = 'nameOrLocation, date|20%, publishedState, publishedDate';
MeetingResult.register();
