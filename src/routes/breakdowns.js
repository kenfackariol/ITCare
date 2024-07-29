const express = require('express');
const router = express.Router();
const breakdownController = require('../controllers/breakdownController');

// Create a new breakdown
router.post('/createBreak', breakdownController.createBreakdown);

// Get all breakdowns
router.get('/allBreakdown', breakdownController.getAllBreakdowns);

// Get a breakdown by ID
router.get('/:idGet', breakdownController.getBreakdownById);

// Update a breakdown by ID
router.put('/:idUpt', breakdownController.updateBreakdown);

// Delete a breakdown by ID
router.delete('/:idDel', breakdownController.deleteBreakdown);

// Get breakdowns by date range
router.get('/date-range/:startDate/:endDate', breakdownController.getBreakdownsByDateRange);

// Get breakdowns by requester name
router.get('/requester/:requesterName', breakdownController.getBreakdownsByRequester);

// Get breakdowns by user ID
router.get('/user/:userId', breakdownController.getBreakdownsByUser);

module.exports = router;
