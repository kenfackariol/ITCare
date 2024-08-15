'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('adminpassword123', salt);
    const userHashedPassword = await bcrypt.hash('userpassword123', salt);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password: adminHashedPassword,
        role: 'admin',
        name: 'Admin User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@example.com',
        password: userHashedPassword,
        role: 'user',
        name: 'Simple User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    console.log('Admin user seeded. Email: admin@example.com, Password: adminpassword123');
    console.log('Simple user seeded. Email: user@example.com, Password: userpassword123');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { 
      email: { 
        [Sequelize.Op.in]: ['admin@example.com', 'user@example.com'] 
      } 
    }, {});
  }
};