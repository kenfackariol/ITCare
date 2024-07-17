const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Breakdown = sequelize.define('Breakdown', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name_requester: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    direction_requester: {
        type: DataTypes.TEXT,
    },
    door_requester: {
        type: DataTypes.TEXT,
    },
    name_Responsable: {
        type: DataTypes.TEXT,
    },
    serial_number: {
        type: DataTypes.TEXT,
    },
    model: {
        type: DataTypes.TEXT,
    },
    os: {
        type: DataTypes.TEXT,
    },
    observation: {
        type: DataTypes.TEXT,
    },
    start_date_intervention: {
        type: DataTypes.DATE,
    },
    end_date_intervention: {
        type: DataTypes.DATE,
    },
    type_intervention: {
        type: DataTypes.TEXT,
    },
    designation_CR: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    materialId: {
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
    tableName: 'breakdowns',
});

// Class Methods
Breakdown.findByDateRange = function (startDate, endDate) {
    return this.findAll({
        where: {
            start_date_intervention: {
                [Op.between]: [startDate, endDate]
            }
        }
    });
};

Breakdown.findByRequester = function (requesterName) {
    return this.findAll({
        where: {
            name_requester: requesterName
        }
    });
};

// Instance Methods
Breakdown.prototype.getDuration = function () {
    if (this.start_date_intervention && this.end_date_intervention) {
        return this.end_date_intervention - this.start_date_intervention;
    }
    return null;
};

// Class Methods
Breakdown.findByUser = function(userId) {
    return this.findAll({
      where: { userId: userId }
    });
  };
  
  // Instance Methods
  Breakdown.prototype.getFullDetails = async function() {
    const materials = await this.getMaterials();
    const user = await this.getUser();
    return {
      ...this.toJSON(),
      materials: materials.map(m => m.toJSON()),
      user: user ? user.toJSON() : null
    };
  };
module.exports = Breakdown;