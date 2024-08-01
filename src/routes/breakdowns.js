const express = require('express');
const breakdownController = require('../controllers/breakdownController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect); 

// Signal a Breakdown
router.post('/', breakdownController.createBreakdown); // Any authenticated user

// Get Breakdown by ID
router.get('/:id', breakdownController.getBreakdownById); // Any authenticated user

// Get All Breakdowns
router.get('/', restrictTo('admin'), breakdownController.getAllBreakdowns); // Only admins

// Update Breakdown
router.patch('/:id', restrictTo('admin', 'manager'), breakdownController.updateBreakdown); // Admins and managers

// Delete Breakdown
router.delete('/:id', restrictTo('admin', 'manager'), breakdownController.deleteBreakdown); // Admins and managers

// Get Breakdowns by Date Range
router.get('/date-range/:startDate/:endDate', breakdownController.getBreakdownsByDateRange); // Any authenticated user

// Get Breakdowns by Requester
router.get('/requester/:requesterName', breakdownController.getBreakdownsByRequester); // Any authenticated user

// Get Breakdowns by User
router.get('/user/:userId', breakdownController.getBreakdownsByUser); // Any authenticated user

module.exports = router;
