'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var auth = require('../../app/controllers/auth.server.controller');

	// Setting up the users profile api
	app.route('/auth/me').get(auth.requiresLogin, auth.me);
	app.route('/auth/me').put(auth.requiresLogin, auth.update);

	// Setting up the users password api
	app.route('/auth/forgot').post(auth.requestForgot);
	app.route('/reset/:token').get(auth.validateResetToken);
	app.route('/auth/reset').post(auth.resetPassword);

	// Setting up the users authentication api
	app.route('/auth/signup').post(auth.signup);
	app.route('/verify/:token').get(auth.verifyToken);
	app.route('/auth/signin').post(auth.signin);
	app.route('/auth/signout').get(auth.signout);

	// Finish by binding the user middleware
	app.param('userId', auth.userByID);
};
