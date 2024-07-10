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
  id_breakdown: {
    type: DataTypes.INTEGER,
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

// Class Methods
Material.findByBreakdown = function(breakdownId) {
  return this.findAll({ where: { id_breakdown: breakdownId } });
};

// Instance Methods
Material.prototype.getFullDetails = async function() {
  const breakdown = await this.getBreakdown();
  return {
    ...this.toJSON(),
    breakdown: breakdown ? breakdown.toJSON() : null
  };
};

module.exports = Material;