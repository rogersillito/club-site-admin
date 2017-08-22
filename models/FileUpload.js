var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var path = require('path');

var FileUpload = new keystone.List('FileUpload', {
	// autokey: { from: 'uploadDate name', path: 'fileId', unique: true }
});

FileUpload.add({
	name: {
		type: String,
		required: true
	},
	uploadDate: {
		type: Types.Datetime,
		default: Date.now,
		noedit: true
	},
	publishedDate: { type: Types.Datetime, hidden: true, index: true },
	file: {
		type: Types.S3File,
		label: 'File',
		note: 'Select the file to upload (using Amazon S3 Storage).',
		allowedTypes: [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
			'image/gif',
			'image/png',
			'image/jpeg',
			'image/bmp',
			'image/webp',
			'text/plain',
			'text/html',
			'audio/mpeg',
			'audio/wav',
			'audio/wave'
		],
		filename: (doc, filename) => {
			var ext = path.extname(filename);
			var ts = doc._.uploadDate.format('YYYY-MM-DD_hh-mm-ss_');
			var name = ts + doc.name + ext;
			return name;
		}
	}
});

FileUpload.schema.pre('save', function(next) {
  this.uploadDate = Date.now();
	if (this.file && this.file.url === '') {
		// prevent removal of contained S3 file
    next(new Error('If you wish to remove this file, please remove the FileUpload itself (click "delete file upload") rather than the file you have attached to it.'));
	}
	return next();
});

// FileUpload.schema.statics.doSomething = function(a,b,c) {
// };



FileUpload.schema.post('remove', function(doc) {
	// TODO: cleanup S3
});

FileUpload.schema.post('save', function(doc) {
	if (doc.file) {
		console.log("doc.file = ", this.file);
	}
});

FileUpload.defaultColumns = 'name, publishedState, publishedDate';
FileUpload.register();
