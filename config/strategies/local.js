'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	db = require('../sequelize');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			db.User
				.scope('active')
				.findOne({
					where: {
						email: email
					}
				})
				.then(function(user) {
					if (!user) {
						return done(null, false, {
							message: 'Unknown user or invalid password'
						});
					}
					if (!user.authenticate(password)) {
						return done(null, false, {
							message: 'Unknown user or invalid password'
						});
					}

					return done(null, user);
				}, function(err) {
					return done(err);
				});
		}
	));
};
