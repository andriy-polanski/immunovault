'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
	db = require('../../config/sequelize'),
	config = require('../../config/config'),
	_ = require('lodash'),
	fs = require('fs'),
	gm = require('gm'),
	sizeOf = require('image-size');

var MAXIMUM_WIDTH = 640;
exports.file_upload = function(req, res) {
	if(req.file) {
		var filedest = req.file.path + '_' + req.file.originalname;
		
		req.file.url = config.app.host + req.file.path.replace(config.publicPath, '') + '_' + req.file.originalname;

		var dimensions = sizeOf(req.file.path);

		if(dimensions.width > MAXIMUM_WIDTH) {
			dimensions.height = dimensions.height * MAXIMUM_WIDTH / dimensions.width;
			dimensions.width = MAXIMUM_WIDTH;

			gm(req.file.path)
				.thumb(dimensions.width, dimensions.height, filedest, 100, function(err, stdout, stderr, command) {
					if(err) {
						console.log(err);
						return res.status(400).send({
							message: 'File upload failed'
						});
					}
					fs.unlink(req.file.path);
					res.send(req.file);	
				});
		}
		else {
			fs.rename(req.file.path, filedest, function(err) {
				if(err) {
					return res.status(400).send({
						message: 'File upload failed'
					});
				}
				res.send(req.file);	
			});
		}
	}
	else {
		return res.status(400).send({
			message: 'File upload failed'
		});
	}
};