const { Breakdown } = require('../models/Breakdown');
const AppError = require('../utils/appError');

class BreakdownService {
    async createBreakdown(data) {
        try {
            const breakdown = await Breakdown.create(data);
            return breakdown;
        } catch (error) {
            throw error;
        }
    }

    async readBreakdown(id) {
        try {
            const breakdown = await Breakdown.findByPk(id);
            return breakdown;
        } catch (error) {
            throw error;
        }
    }

    async updateBreakdown(id, data) {
        try {
            const breakdown = await Breakdown.findByPk(id);
            if (!breakdown) {
                throw new Error('Breakdown not found');
            }
            await breakdown.update(data);
            return breakdown;
        } catch (error) {
            throw error;
        }
    }

    async deleteBreakdown(id) {
        try {
            const breakdown = await Breakdown.findByPk(id);
            if (!breakdown) {
                throw new Error('Breakdown not found');
            }
            await breakdown.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getBreakdownsByDateRange(startDate, endDate) {
        try {
            const breakdowns = await Breakdown.findByDateRange(startDate, endDate);
            return breakdowns;
        } catch (error) {
            throw error;
        }
    }

    async getBreakdownsByRequester(requesterName) {
        try {
            const breakdowns = await Breakdown.findByRequester(requesterName);
            return breakdowns;
        } catch (error) {
            throw error;
        }
    }

    async getBreakdownsByUser(userId) {
        try {
            const breakdowns = await Breakdown.findByUser(userId);
            return breakdowns;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BreakdownService();