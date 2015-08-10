'use strict';

/**
 * Module dependencies.
 */
var auth = require('../../app/controllers/auth.server.controller'),
	common = require('../../app/controllers/common.server.controller'),
	config  = require('../../config/config'),
	multer  = require('multer'),
	upload = multer({ dest: config.uploadDir });

module.exports = function(app) {
	app.route('/file/upload')
		.post(auth.requiresLogin, upload.single('file'), common.file_upload);
};