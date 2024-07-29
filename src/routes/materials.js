const express = require('express');
const materialController = require('../controllers/materialController');

const router = express.Router();

router.post('/createMaterial', materialController.createMaterial);
router.get('/getMaterials', materialController.getMaterials);
router.get('/getMaterialById/:id', materialController.getMaterialById);
router.patch('/updateMaterial/:id', materialController.updateMaterial);
router.delete('/deleteMaterial/:id', materialController.deleteMaterial);

module.exports = router;