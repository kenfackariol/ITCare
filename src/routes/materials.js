const express = require('express');
const materialController = require('../controllers/materialController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Routes for authenticated users
router.get('/', materialController.getAllMaterials); // Get all materials
router.get('/:id', materialController.getMaterialById); // Get material by ID
router.post('/', restrictTo('admin'), materialController.createMaterial); // Create material (admin only)
router.patch('/:id', restrictTo('admin'), materialController.updateMaterial); // Update material (admin only)
router.delete('/:id', restrictTo('admin'), materialController.deleteMaterial); // Delete material (admin only)

module.exports = router;
