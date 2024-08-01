const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  tableName: 'materials',
});


// Instance Methods
Material.prototype.getFullDetails = async function() {
  const breakdowns = await this.getBreakdowns(); // Use the association alias 'breakdowns'
  return {
    ...this.toJSON(),
    breakdowns: breakdowns.map(b => b.toJSON())
  };
};

module.exports = Material;