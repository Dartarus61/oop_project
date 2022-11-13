'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('User', [{
        name: 'ADMIN',
        surname: 'ADMIN',
        email: 'admin@admin.com',
        password: 'qwerty123',

      }], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
