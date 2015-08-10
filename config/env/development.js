'use strict';

module.exports = {
	db: {
        host: 'localhost',
        name: 'wwitb_newhomz',
        password: 'UbWnBrrYV6RmDGT2',
        username: 'wwitb_homz'
    },
	port: process.env.PORT || 3000,
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			//stream: 'access.log'
		}
	},
	app: {
		admin_name: 'Support',
		admin_email: 'support@immunovault.com',
		host: 'http://www.immunovault.com'
	},
	smtp: {
		host: 'smtp.mandrillapp.com',
		port: 587,
		password: 'CF-aL2MD1Ck6zRXdKUZMGQ',
		username: 'immunovault@gmail.com'
	}
};
