const Breakdown = require("../models/Breakdown");
const Material = require("../models/Material");
const User = require("../models/User");

function applyAssociations() {
  Material.belongsTo(Breakdown, { foreignKey: 'id_breakdown', as: 'breakdown' });
  Breakdown.hasMany(Material, { foreignKey: 'id_breakdown', as: 'materials' });
  
  User.hasMany(Breakdown, { foreignKey: 'userId', as: 'breakdowns' });
  Breakdown.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

module.exports = applyAssociations;