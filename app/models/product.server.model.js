'use strict';
/**
 * Product Model
 */

var md5 = require('md5');

module.exports = function(sequelize, DataTypes) {

	var Product = sequelize.define('Product', 
		{
			userId: DataTypes.INTEGER(32),
      disease: DataTypes.TEXT,
      specimen: DataTypes.STRING,
      collectionDate: DataTypes.DATE,
      bodyType: DataTypes.STRING,
      tissueOfOrigin: DataTypes.STRING,
      positiveControls: DataTypes.TEXT,
      negativeControls: DataTypes.TEXT,
      finalDiagnosis: DataTypes.TEXT,
      country: DataTypes.STRING,
      status: DataTypes.STRING(32), // DRAFTED, SUBMITTED, APPROVED, DENIED, DELETED
		},
		{ 
			scopes: {
				deleted: {
					where: {
						status: 'DELETED'
					}
				},
				approved: {
					where: {
						status: 'APPROVED'
					}
				},
				denied: {
					where: {
						status: 'DENIED'
					}
				},
				submitted: {
					where: {
						status: 'SUBMITTED'
					}
				},
				drafted: {
					where: {
						status: 'DRAFTED'
					}
				}
			},
			associate: function(models) {
				Product.belongsTo(models.User);
			},	
			tableName: 'products'
		}
	);

	return Product;
};
