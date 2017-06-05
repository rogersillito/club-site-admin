var keystone = require('keystone');
var Types = keystone.Field.Types;
var utils = require('../lib/utils');
var moment = require('moment');
var addPublishableBehaviours = require('../lib/publishableMixin.js');

/**
 * MeetingResult Model
 * =============
 */

var MeetingResult = new keystone.List('MeetingResult', {
    autokey: { from: 'nameOrLocation date', path: 'key', unique: true },
    map: { name: 'nameOrLocation'}
});

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
    resultHtml: { type: Types.Html, wysiwyg: {
        additionalPlugins: 'table',
        additionalOptions: {
            toolbar: 'undo redo | bold italic | table',
            table_toolbar: "tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
            table_appearance_options: false,
            table_advtab: false,
            table_cell_advtab: false,
            table_row_advtab: false
        }
    }}
});

addPublishableBehaviours(MeetingResult);

// MeetingResult.schema.virtual('dumpMe').get(function() {
//     return this;
// });
MeetingResult.schema.set('toJSON', {
    virtuals: true
});

MeetingResult.defaultColumns = 'nameOrLocation, date|20%, publishedDate';
MeetingResult.register();
