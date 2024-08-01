const Joi = require('joi');
const Breakdown = require('../models/Breakdown');
const AppError = require('../utils/appError');

// Define validation schemas
const breakdownSchema = Joi.object({
    name_requester: Joi.string().required(),
    direction_requester: Joi.string().optional(),
    door_requester: Joi.string().optional(),
    name_responsable: Joi.string().optional(),
    serial_number: Joi.string().optional(),
    model: Joi.string().optional(),
    os: Joi.string().optional(),
    observation: Joi.string().optional(),
    start_date_intervention: Joi.date().optional(),
    end_date_intervention: Joi.date().optional(),
    type_intervention: Joi.string().optional(),
    designation_CR: Joi.string().optional(),
    materialId: Joi.number().integer().required(),
});

// New schema for updates
const breakdownUpdateSchema = Joi.object({
    name_requester: Joi.string().optional(),
    direction_requester: Joi.string().optional(),
    door_requester: Joi.string().optional(),
    name_responsable: Joi.string().optional(),
    serial_number: Joi.string().optional(),
    model: Joi.string().optional(),
    os: Joi.string().optional(),
    observation: Joi.string().optional(),
    start_date_intervention: Joi.date().optional(),
    end_date_intervention: Joi.date().optional(),
    type_intervention: Joi.string().optional(),
    designation_CR: Joi.string().optional(),
    materialId: Joi.number().integer().optional(),
}).min(1); // Ensure at least one field is provided for update

class BreakdownService {
    async createBreakdown(data, userId) {
        // Validate data
        const { error } = breakdownSchema.validate(data);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        // Set additional fields
        data.userId = userId;
        data.createdAt = new Date();
        data.updatedAt = new Date();

        try {
            const breakdown = await Breakdown.create(data);
            return breakdown;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to create breakdown', 500);
            }
        }
    }

    async readBreakdown(id) {
        try {
            const breakdown = await Breakdown.findByPk(id);
            if (!breakdown) {
                throw new AppError('Breakdown not found', 404);
            }
            return breakdown;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to read breakdown', 500);
            }
        }
    }

    async updateBreakdown(id, data) {
        // Validate data
        id = parseInt(id, 10);
        if (isNaN(id)) {
            throw new AppError('Invalid user ID', 400);
        }
        const { error } = breakdownUpdateSchema.validate(data);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        try {
            const breakdown = await Breakdown.findByPk(id);
            if (!breakdown) {
                throw new AppError('Breakdown not found', 404);
            }
            data.updatedAt = new Date();
            await breakdown.update(data);
            return breakdown;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to update breakdown', 500);
            }
        }
    }

    async deleteBreakdown(id) {
        try {
            const breakdown = await Breakdown.findByPk(id);
            if (!breakdown) {
                throw new AppError('Breakdown not found', 404);
            }
            await breakdown.destroy();
            return { message: 'Breakdown deleted successfully' };
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to delete breakdown', 500);
            }
        }
    }

    async getBreakdownsByDateRange(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime())) {
                throw new AppError(`Invalid start date format: ${startDate}`, 400);
            }
            if (isNaN(end.getTime())) {
                throw new AppError(`Invalid end date format: ${endDate}`, 400);
            }

            const breakdowns = await Breakdown.findByDateRange(start, end);
            return breakdowns;
        } catch (err) {
            if (err instanceof AppError) {
                throw err; // Re-throw AppErrors
            }
            throw new AppError('Failed to fetch breakdowns by date range', 500);
        }
    }

    async getBreakdownsByRequester(requesterName) {
        try {
            const breakdowns = await Breakdown.findByRequester(requesterName);
            return breakdowns;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to fetch breakdowns by requester', 500);
            }
        }
    }

    async getBreakdownsByUser(userId) {
        try {
            const parsedUserId = parseInt(userId, 10);
            if (isNaN(parsedUserId)) {
                throw new AppError('Invalid user ID', 400);
            }

            const breakdowns = await Breakdown.findAll({
                where: { userId: parsedUserId }
            });
            return breakdowns;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to fetch breakdowns by user', 500);
            }
        }
    }

    async getAllBreakdowns() {
        try {
            const breakdowns = await Breakdown.findAll();
            return breakdowns;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError('Failed to fetch breakdowns', 500);
            }
        }
    }
}

module.exports = new BreakdownService();
