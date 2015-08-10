'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
	app.route('/login').get(core.login);
	app.route('/logout').get(core.logout);
	app.route('/signup').get(core.signup);

	app.route('/mail_template').get(core.mail_template);
};
