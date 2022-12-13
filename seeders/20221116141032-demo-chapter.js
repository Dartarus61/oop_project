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
                    name: 'Python',
                },

                {
                    name: 'JavaFX',
                    idParent: 1,
                    path: 'Java.JavaFX',
                },
                {
                    name: 'FXML',
                    idParent: 1,
                    path: 'Java.FXML',
                },
                {
                    name: 'Pane',
                    idParent: 1,
                    path: 'Java.Pane',
                },

                {
                    name: 'Introduction',
                    idParent: 2,
                    path: 'Python.Introduction',
                },
                {
                    name: 'Base',
                    idParent: 2,
                    path: 'Python.Base',
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Chapter', null, {})
    },
}
