const { Sequelize, DataTypes } = require('sequelize');

// Configuration de la connexion à la base de données
const dbConfig = {
  dialect: 'mysql', // ou 'postgres' pour PostgreSQL
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'itcareDB'
};

// Création de l'instance Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Test de la connexion à la base de données
sequelize.authenticate()
.then(() => {
  console.log('Connected to the database!');
})
.catch(err => {
  console.error('Error connecting to the database:', err);
});

// Exportation de l'instance Sequelize
module.exports = sequelize;