'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'reset_passwords',
      {
        id: {
          type: Sequelize.BIGINT(64),
          primaryKey: true,
          autoIncrement: true
        },
        email: Sequelize.STRING,
        token: Sequelize.STRING,
        expireAt: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('reset_passwords');
  }
};
