const { Material } = require('../models/Material');

class MaterialService {
  async createMaterial(data) {
    try {
      const material = await Material.create(data);
      return material;
    } catch (error) {
      throw error;
    }
  }

  async getMaterials() {
    try {
      const materials = await Material.findAll();
      return materials;
    } catch (error) {
      throw error;
    }
  }

  async getMaterialById(id) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error('Material not found');
      }
      return material;
    } catch (error) {
      throw error;
    }
  }

  async updateMaterial(id, data) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error('Material not found');
      }
      await material.update(data);
      return material;
    } catch (error) {
      throw error;
    }
  }

  async deleteMaterial(id) {
    try {
      const material = await Material.findByPk(id);
      if (!material) {
        throw new Error('Material not found');
      }
      await material.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getMaterialsByBreakdown(breakdownId) {
    try {
      const materials = await Material.findByBreakdown(breakdownId);
      return materials;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MaterialService();