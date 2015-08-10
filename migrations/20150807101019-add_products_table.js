'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'products',
      {
        id: {
          type: Sequelize.INTEGER(32),
          primaryKey: true,
          autoIncrement: true
        },
        userId: Sequelize.INTEGER(32),
        disease: Sequelize.TEXT,
        specimen: Sequelize.STRING,
        collectionDate: Sequelize.DATE,
        bodyType: Sequelize.STRING,
        tissueOfOrigin: Sequelize.STRING,
        positiveControls: Sequelize.TEXT,
        negativeControls: Sequelize.TEXT,
        finalDiagnosis: Sequelize.TEXT,
        country: Sequelize.STRING,
        status: Sequelize.STRING(32), // DRAFTED, SUBMITTED, APPROVED, DENIED, DELETED
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('products');
  }
};
