'use strict';

var	path = require('path'),
	templateDir = path.resolve(__dirname, '..', 'views', 'emails'),
	emailTemplates = require('email-templates'),
	config = require('../../config/config');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.login = function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}

	res.render('login');
};

exports.logout = function(req, res) {
	req.logout();
	return res.redirect('/login');
};

exports.signup = function(req, res) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}

	res.render('signup');
};

exports.mail_template = function(req, res) {
	var view = 'reset_password';
	var param = {
		token: 'sadflkjasdfjklsadfkjlasdfkj'
	};
	emailTemplates(templateDir, function(err, template) {
		if(err) {
			console.log(err);
			return;
		}
		template(view, {config: config, param: param}, function(err, html, text) {
			res.send(html);
		});
	});
};