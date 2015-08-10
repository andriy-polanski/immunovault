'use strict';

var nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport'),
	http = require('http'),
	path = require('path'),
	templateDir = path.resolve(__dirname, '..', 'views', 'emails'),
	emailTemplates = require('email-templates'),
	config = require('../../config/config');

var send_email = function(email) {
	console.log('--Sending email to ' + email.to + '--');

	emailTemplates(templateDir, function(err, template) {
		if(err) {
			console.log(err);
			return;
		}
		template(email.view, {config: config, param: email.param}, function(err, html, text) {
			var transport = nodemailer.createTransport(smtpTransport({
				host: config.smtp.host,
				port: config.smtp.port,
				auth: {
					user: config.smtp.username,
					pass: config.smtp.password
				}
			}));

			var body = {
				from: email.from,
				to: email.to,
				subject: email.subject,
				html: html
			};

			transport.sendMail(body);
		});
	});
};

exports.email = function(email) {
	email.from = email.from || config.app.admin_name + '<' + config.app.admin_email + '>';
	send_email(email);
};