'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('breakdowns', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name_requester: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      direction_requester: {
        type: Sequelize.TEXT,
      },
      door_requester: {
        type: Sequelize.TEXT,
      },
      name_Responsable: {
        type: Sequelize.TEXT,
      },
      serial_number: {
        type: Sequelize.TEXT,
      },
      model: {
        type: Sequelize.TEXT,
      },
      os: {
        type: Sequelize.TEXT,
      },
      observation: {
        type: Sequelize.TEXT,
      },
      start_date_intervention: {
        type: Sequelize.DATE,
      },
      end_date_intervention: {
        type: Sequelize.DATE,
      },
      type_intervention: {
        type: Sequelize.TEXT,
      },
      designation_CR: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      materialId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materials',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('breakdowns');
  }
};