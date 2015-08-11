'use strict';

module.exports = {
	db: {
        host: 'localhost',
        name: 'immunovault_db',
        password: '!@#456&*(0-=',
        username: 'root'
    },
	port: process.env.PORT || 80,
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	app: {
		admin_name: 'Support',
		admin_email: 'support@immunovault.com',
		host: 'http://54.149.157.238'
	},
	smtp: {
		host: 'smtp.mandrillapp.com',
		port: 587,
		password: 'CF-aL2MD1Ck6zRXdKUZMGQ',
		username: 'immunovault@gmail.com'
	}
};
