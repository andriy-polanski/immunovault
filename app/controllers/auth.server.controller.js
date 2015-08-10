'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	db = require('../../config/sequelize'),
	errorHandler = require('./errors.server.controller'),
	passport = require('passport'),
	md5 = require('md5'),
	moment = require('moment'),
	mailer = require('../lib/mailer');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// Init Variables
	var user = db.User.build(req.body);
	var message = null;

	// Add missing user fields
	user.role = 'USER';
	user.status = 'UNVERIFIED';
	user.verificationToken = md5(moment());
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
				.then(function(user) {
					// Remove sensitive data before login
					user.password = undefined;
					res.status(200).send({

					});

					// send email
					mailer.email({
						to: user.email,
						subject: 'Confirm your Immunovault Account',
						view: 'signup',
						param: {
							name: user.firstName + ' ' + user.lastName,
							verificationToken: user.verificationToken
						}
					});
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
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			console.log(err);
			res.status(400).send(err);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			req.login(user, function(err) {
				if (err) {
					console.log(err);
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// Merge existing user
	if(req.body.password) {
		req.body.password = db.User.encryptPassword(req.body.password);
	}
	user = _.extend(user, req.body);


	user.save()
		.then(function() {

			res.json(user);
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Verify by email
 */
 exports.verifyToken = function(req, res) {
 	var token = req.params.token;

 	var render = function(status, message) {
		res.render('verify', {
			status: status,
			message: message
		});
 	};
 	db.User
 		.scope('unverified')
 		.find({where:{verificationToken: token}})
 		.then(function(user) {
 			if(!user) {
 				return render(false, 'Invalid token.');
 			}

 			user.verificationToken = '';
 			user.status = 'ACTIVE';
 			user.save()
 				.then(function(user) {
	 				req.login(user, function(err) {
						return render(true, '');
					});
 				}, function(err) {
					return render(false, errorHandler.getErrorMessage(err));
 				});
 		}, function(err) {
			return render(false, errorHandler.getErrorMessage(err));
 		});
 };
/**
 * Request forget password
 */
exports.requestForgot = function(req, res) {
	var email = req.body.email;

	db.User
		.scope('not_deleted')
		.find({where:{email: { like: user.email}}})
		.then(function(result) {
      if(!result) {
      	return res.status(400).send({
					message: 'Email address is not registered.'
				});
      }

      var resetRequest = db.ResetPassword.build({
      	email: email,
      	token: md5(moment()),
      	expireAt: moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
      });

      resetRequest.save()
      	.then(function(request) {
					return res.status(200).send({
					});
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
 * Validate reset password token
 */
exports.validateResetToken = function(req, res) {
	var token = req.params.token;

	db.ResetPassword
		.scope('not_expired')
		.find({where:{token:token}})
		.then(function(result){
			if(result) {
				return res.status(200).send({
				});
			}
			else {
				return res.status(400).send({
					message: 'Invalid token.'
				});
			}
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Reset password with token
 */
exports.resetPassword = function(req, res) {
	var token = req.params.token;
	var password = req.body.password;
	if(!password || password == '') {
		return res.status(400).send({
			message: 'Please provide password.'
		});
	}

	db.ResetPassword
		.scope('not_expired')
		.find({where:{token:token}})
		.then(function(result){
			if(result) {
				db.User
					.scope('not_deleted')
					.find({where:{email: { like: user.email}}})
					.then(function(user) {
						if(!user) {
							return res.status(400).send({
								message: 'Account with this email address is not longer available.'
							});
						}

						user.password = db.User.encryptPassword(password);
						user.save()
							.then(function(user) {
								req.login(user, function(err) {
									if(err) console.log(err);
									res.json(user);
								});
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
			}
			else {
				return res.status(400).send({
					message: 'Invalid token.'
				});
			}
		}, function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	db.User.findById(id)
		.then(function(user) {
			if (!user) return next(new Error('Failed to load User ' + id));
			req.profile = user;
			next();
		}, function(err) {
			return next(err);
		});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(role) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (req.user.role === role) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};
