const Breakdown = require("../models/Breakdown");
const Material = require("../models/Material");
const User = require("../models/User");

function applyAssociations() {
  Material.hasMany(Breakdown, { foreignKey: 'materialId', as: 'breakdowns' });
  Breakdown.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });
  
  User.hasMany(Breakdown, { foreignKey: 'userId', as: 'breakdowns' });
  Breakdown.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

module.exports = applyAssociations;