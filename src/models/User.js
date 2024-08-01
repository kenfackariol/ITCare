const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email address must be valid'
      },
      notNull: {
        msg: 'Email is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required'
      },
      len: {
        args: [8, 100],
        msg: 'Password must be between 8 and 100 characters long'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
    validate: {
      isIn: {
        args: [['user', 'admin']],
        msg: 'Role must be user or admin'
      },
      notNull: {
        msg: 'Role is required'
      }
    }
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      user.password = await User.hashPassword(user.password);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await User.hashPassword(user.password);
      }
    }
  }
});

// Class Methods
User.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS, 10));
  return bcrypt.hash(password, salt);
};

User.findByEmail = function (email) {
  return this.findOne({ where: { email, isActive: true } });
};

// Instance Methods
User.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
