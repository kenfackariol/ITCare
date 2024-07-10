const logger = require('./logger');
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'mysql',
};

const config = {
  development: {
    ...baseConfig,
    logging: (msg) => logger.debug(msg)
  },
  test: {
    ...baseConfig,
    logging: false
  },
  production: {
    ...baseConfig,
    logging: false
  }
};

// This is for Sequelize CLI
module.exports = config;

// This is for your application
const sequelize = new Sequelize(config[env]);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    logger.info('Model associations have been applied.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;