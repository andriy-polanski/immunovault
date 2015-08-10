'use strict';

/**
 * Module dependencies.
 */
var auth = require('../../app/controllers/auth.server.controller'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
	app.route('/users')
		.get(auth.hasAuthorization('ADMIN'), users.list)
		.post(auth.hasAuthorization('ADMIN'), users.create);
	app.route('/users/:userId')
		.get(auth.hasAuthorization('ADMIN'), users.get)
		.put(auth.hasAuthorization('ADMIN'), users.update)
		.delete(auth.hasAuthorization('ADMIN'), users.delete);

	app.param('userId', users.userByID);
};