'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER(32),
          primaryKey: true,
          autoIncrement: true
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        company: Sequelize.STRING,
        phone: Sequelize.STRING(20),
        role: Sequelize.ENUM('ADMIN', 'USER'),
        verificationToken: Sequelize.STRING,
        status: Sequelize.STRING(32), // UNVERIFIED, ACTIVE, DELETED, BLOCKED
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('users');
  }
};
