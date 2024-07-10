'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword123', salt);

    await queryInterface.bulkInsert('Users', [{
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    console.log('Admin user seeded. Email: admin@example.com, Password: adminpassword123');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  }
};