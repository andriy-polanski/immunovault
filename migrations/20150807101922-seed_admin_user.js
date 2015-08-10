'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.sequelize.query('INSERT INTO `users` (`email`, `password`, `firstName`, `lastName`, `company`, `phone`, `role`, `verificationToken`, `status`) VALUES("admin@admin.com", "098f6bcd4621d373cade4e832627b4f6", "Kyle", "Dunn", "Kyle company", "", "ADMIN", "", "ACTIVE");');
  },

  down: function (queryInterface, Sequelize) {
  }
};
