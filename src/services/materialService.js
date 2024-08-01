const Joi = require('joi');
const Material = require('../models/Material');
const AppError = require('../utils/appError');

// Define validation schema excluding timestamps
const materialSchema = Joi.object({
    name: Joi.string().required()
});

class MaterialService {
    async createMaterial(data) {
        // Validate data
        const { error } = materialSchema.validate(data);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        try {
            // Create the material with additional fields
            const material = await Material.create({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return material;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new AppError('Failed to create material', 500);
            }
        }
    }

    async readMaterial(id) {
        try {
            const material = await Material.findByPk(id);
            if (!material) {
                throw new AppError('Material not found', 404);
            }
            return material;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new AppError('Failed to retrieve material', 500);
            }
        }
    }

    async updateMaterial(id, data) {
        // Validate data
        const { error } = materialSchema.validate(data);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        try {
            const material = await Material.findByPk(id);
            if (!material) {
                throw new AppError('Material not found', 404);
            }
            await material.update({
                ...data,
                updatedAt: new Date()
            });
            return material;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new AppError('Failed to update material', 500);
            }
        }
    }

    async deleteMaterial(id) {
        try {
            const material = await Material.findByPk(id);
            if (!material) {
                throw new AppError('Material not found', 404);
            }
            await material.destroy();
            return { message: 'Material deleted successfully' };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new AppError('Failed to delete material', 500);
            }
        }
    }

    async getAllMaterials() {
        try {
            const materials = await Material.findAll();
            return materials;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            } else {
                throw new AppError('Failed to retrieve materials', 500);
            }
        }
    }
}

module.exports = new MaterialService();
