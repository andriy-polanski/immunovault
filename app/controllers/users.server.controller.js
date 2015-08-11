'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
	db = require('../../config/sequelize'),
	_ = require('lodash');

/**
 * Create a user
 */
exports.create = function(req, res) {
	// Init Variables
	var user = db.User.build(req.body);
	var message = null;

	// Add missing user fields
	user.password = db.User.encryptPassword(user.password);

	// Then save the user
	db.User.find({where:{email:user.email}})
		.then(function(result) {
	        if(result) {
	        	return res.status(400).send({
					message: 'Email address is already in use.'
				});
	        }
			user.save()
				.then(function() {
					user.password = undefined;
					res.json(user);
				}, function(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				});
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Show the current user
 */
exports.get = function(req, res) {
	res.json(req.profile);
};

/**
 * Update a user
 */
exports.update = function(req, res) {
	var user = req.profile;

	var message = null;

	// Merge existing user
	if(req.body.password && req.body.password != "") {
		req.body.password = db.User.encryptPassword(req.body.password);
	}
	else {
		delete req.body.password;
	}
	user = _.extend(user, req.body);

	db.User.find({where:{email:user.email}})
		.then(function(result) {
			if(result && result.id !== user.id) {
	        	return res.status(400).send({
					message: 'Email address is already in use.'
				});
			}
			
			user.save()
				.then(function() {

					res.json(user);
				}, function(err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				});
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Delete an user
 */
exports.delete = function(req, res) {
	var user = req.profile;

	user.status = 'DELETED';

	user.save()
		.then(function() {
			res.send(user);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * List of users
 */
exports.list = function(req, res) {
	db.User.findAll({include: [{model: db.Product, required: false}]})
		.then(function(users) {
			res.send(users);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * user middleware
 */
exports.userByID = function(req, res, next, id) {

	db.User.findById(id, {include: [{model: db.Product, required: false}]})
		.then(function(user) {
			if (!user) return next(new Error('Failed to load User ' + id));
			req.profile = user;
			next();
		}, function(err) {
			return next(err);
		});
};
