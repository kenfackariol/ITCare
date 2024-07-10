require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');
const { sequelize, connectDB } = require('./src/config/database');
const applyAssociations = require('./src/utils/associations');

const port = process.env.PORT || 3000;

const initializeDatabase = async () => {
  await connectDB();
  applyAssociations();
  await sequelize.sync(); // This will create tables if they don't exist
  logger.info('Database synchronized');
};

initializeDatabase().then(() => {
  app.listen(port, () => {
    logger.info(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
  });
}).catch(err => {
  logger.error('Failed to initialize database:', err);
  process.exit(1);
});