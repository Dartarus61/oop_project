'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Role', [{
        value: 'ADMIN',
        description: 'administrator'
      },
      {
       value: 'USER',
        description: 'default user'
      },
      {
        value: 'CREATOR',
        description: 'writer'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Role', null, {});
  }
};
