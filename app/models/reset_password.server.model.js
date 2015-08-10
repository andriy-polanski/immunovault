'use strict';
/**
 * Reset Password Model
 */

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {

	var ResetPassword = sequelize.define('ResetPassword', 
		{
			email: DataTypes.STRING,
			token: DataTypes.STRING,
			expireAt: DataTypes.DATE
		},
		{
			scopes: {
				not_expired: {
					where: {
						expireAt: {
							gt: moment().format('YYYY-MM-DD HH:mm:ss')
						}
					}
				}
			},
			tableName: 'reset_passwords'
		}
	);

	return ResetPassword;
};
