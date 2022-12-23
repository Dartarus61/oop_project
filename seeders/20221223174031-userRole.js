'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'UserRoles',
            [
                {
                    roleId: 1,
                    userId: 1,
                },
                {
                    roleId: 3,
                    userId: 2,
                },
                {
                    roleId: 2,
                    userId: 3,
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('People', null, {})
    },
}
