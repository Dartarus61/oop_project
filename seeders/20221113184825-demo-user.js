'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(
            'User',
            [
                {
                    name: 'ADMIN',
                    surname: 'ADMIN',
                    email: 'admin@admin.com',
                    password: '$2b$07$J7YI82wVdS5TCE1L0szU8u0hCct4SaBgu8rzEJK7o5ojnpICj9Vfy',
                    isActivated: true,
                },
                {
                    name: 'Дмитрий',
                    surname: 'Кошмарный',
                    email: 'creator@creator.com',
                    password: '$2b$07$J7YI82wVdS5TCE1L0szU8u0hCct4SaBgu8rzEJK7o5ojnpICj9Vfy',
                    isActivated: true,
                },
                {
                    name: 'Иван',
                    surname: 'Иванов',
                    email: 'user@user.com',
                    password: '$2b$07$J7YI82wVdS5TCE1L0szU8u0hCct4SaBgu8rzEJK7o5ojnpICj9Vfy',
                    isActivated: true,
                },
            ],
            {}
        )
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('User', null, {})
    },
}
