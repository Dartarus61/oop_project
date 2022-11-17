'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(
            'Chapter',
            [
                {
                    name: 'Java',
                },

                {
                    name: 'JavaFX',
                    idParent: 1,
                    path: 'Java.JavaFX',
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Chapter', null, {})
    },
}
