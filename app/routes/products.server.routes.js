'use strict';

/**
 * Module dependencies.
 */
var auth = require('../../app/controllers/auth.server.controller'),
	products = require('../../app/controllers/products.server.controller');

module.exports = function(app) {
	app.route('/products')
		.get(auth.requiresLogin, products.list)
		.post(auth.requiresLogin, products.create);
	app.route('/products/:productId')
		.get(auth.requiresLogin, products.hasAuthorization('READ'), products.get)
		.put(auth.requiresLogin, products.hasAuthorization('WRITE'), products.update)
		.delete(products.hasAuthorization('WRITE'), products.delete);

	app.param('productId', products.productByID);
};