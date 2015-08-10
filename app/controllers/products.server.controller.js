'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
	db = require('../../config/sequelize'),
	_ = require('lodash');

/**
 * Create a product
 */
exports.create = function(req, res) {
	// Init Variables
	var product = db.Product.build(req.body);

	req.body.status = 'APPROVED';
	// Then save the product
	product.save()
		.then(function() {
			res.json(product);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Show the current product
 */
exports.get = function(req, res) {
	res.json(req.product);
};

/**
 * Update a product
 */
exports.update = function(req, res) {
	var product = req.product;

	product = _.extend(product, req.body);

	product.save()
		.then(function() {
			res.json(product);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Delete an product
 */
exports.delete = function(req, res) {
	var product = req.product;

	product.status = 'DELETED';

	product.save()
		.then(function() {
			res.send(product);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * List of products
 */
exports.list = function(req, res) {
	var $promise = null;
	if(req.user.role === 'ADMIN') {
		$promise = db.Product.scope('not_deleted').findAll({ include: [{ model: db.User, required: false}]});
	}
	else {
		$promise = db.Product.scope('approved').findAll({ include: [{ model: db.User, required: false}]});
	}
	$promise
		.then(function(products) {
			res.send(products);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * product middleware
 */
exports.productByID = function(req, res, next, id) {

	db.Product.scope('not_deleted').findById(id, { include: [{ model: db.User, required: false}]})
		.then(function(product) {
			if (!product) return next(new Error('Failed to load product ' + id));
			req.product = product;
			next();
		}, function(err) {
			return next(err);
		});
};

exports.hasAuthorization = function(permission) {
	return function(req, res, next) {
		if(req.user.role === 'ADMIN') {
			next();
		}
		else if(permission == 'READ') {
			next();
		}
		else if(permission == 'WRITE' && req.product.userId == req.user.id) {
			next();
		}
		else {
			return res.status(403).send({
				message: 'User is not authorized'
			});
		}
	};
};
