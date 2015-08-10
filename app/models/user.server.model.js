'use strict';
/**
 * User Model
 */

var md5 = require('md5');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      company: DataTypes.STRING,
      phone: DataTypes.STRING(20),
      role: DataTypes.ENUM('ADMIN', 'USER'),
      verificationToken: DataTypes.STRING,
      status: DataTypes.STRING(32), // UNVERIFIED, ACTIVE, DELETED, BLOCKED
		},
		{ 
			scopes: {
				deleted: {
					where: {
						status: 'DELETED'
					}
				},
				not_deleted: {
					where: {
						status: {
							ne: 'DELETED'
						}
					}
				},
				active: {
					where: {
						status: 'ACTIVE'
					}
				},
				unverified: {
					where: {
						status: 'UNVERIFIED'
					}
				},
				blocked: {
					where: {
						status: 'BLOCKED'
					}
				}
			},
			classMethods: {
				encryptPassword: function(password) {
					return md5(password);
				}
			},
			instanceMethods: {
				authenticate: function(password) {
					return md5(password) === this.password;
				}
			},
			associate: function(models) {
				User.hasMany(models.Product);
			},	
			tableName: 'users'
		}
	);

	return User;
};
