var keystone = require('keystone');
var Types = keystone.Field.Types;
var utils = require('../lib/utils');

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
	  date: { type: Types.Date, default: Date.now(), required: true },
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

MeetingResult.schema.virtual('dumpMe').get(function() {
    return this;
});
MeetingResult.schema.set('toJSON', {
	  virtuals: true
});

MeetingResult.defaultColumns = 'nameOrLocation, date|20%';
MeetingResult.register();
