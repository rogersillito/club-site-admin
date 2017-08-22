var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var path = require('path');
var AWS = require('aws-sdk');

var FileUpload = new keystone.List('FileUpload', {
	autokey: { from: 'name', path: 'fileId', unique: true }
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
			var name = ts + doc.fileId + ext;
			return name;
		}
	},
	originalName: {
		label: 'Uploaded Filename',
		type: String,
		noedit: true,
		watch: true,
		value: function() { return this.file && this.file.originalname; }
	}
});

const s3Options = {
	accessKeyId: process.env.S3_KEY,
	secretAccessKey: process.env.S3_SECRET,
	region: process.env.S3_REGION
};
AWS.config.update(s3Options);
var s3Client = new AWS.S3();

FileUpload.schema.pre('save', function(next) {
  this.uploadDate = Date.now();
	if (this.file && this.file.url === '') {
		// prevent removal of contained S3 file
    next(new Error('If you wish to remove this file, please remove the FileUpload itself (click "delete file upload") rather than the file you have attached to it.'));
	}
	return next();
});

FileUpload.schema.post('remove', function(doc) {
	if (doc.file && doc.file.filename) {
		const filename = doc.file.filename;
		// cleanup file in S3
		const deleteParams = {
			Bucket: process.env.S3_BUCKET,
			Delete: {
				Objects: [{ Key: filename }]
			}
		};
		s3Client.deleteObjects(deleteParams, (err, data) => {
			if (err) {
				console.error(err, err.stack);
				return;
			}
			const msg = _.find(data.Deleted, obj => obj.Key === filename) ? "Cleaned up" : "Failed to delete";
			console.log(msg + ' S3 file: ' + filename);
		});
	}
});

FileUpload.schema.post('save', function(doc) {
	//TODO: TEST IF... need to do any cleanup if file changes in some way?
	if (doc.file) {
		// console.log("doc.file = ", this.file);
	}
});

FileUpload.defaultColumns = 'name, publishedState, publishedDate';
FileUpload.register();
