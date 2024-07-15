
// materialController.js
const materialService = require('../services/materialService');
const { catchAsync } = require('../utils/catchAsync');

exports.createMaterial = catchAsync(async (req, res) => {
  const material = await materialService.createMaterial(req.body);
  res.status(201).json({ material });
});

exports.getMaterials = catchAsync(async (req, res) => {
  const materials = await materialService.getMaterials();
  res.status(200).json({ materials });
});

exports.getMaterialById = catchAsync(async (req, res) => {
  const material = await materialService.getMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ message: 'Material not found' });
  }
  res.status(200).json({ material });
});

exports.updateMaterial = catchAsync(async (req, res) => {
  const material = await materialService.updateMaterial(req.params.id, req.body);
  res.status(200).json({ material });
});

exports.deleteMaterial = catchAsync(async (req, res) => {
  await materialService.deleteMaterial(req.params.id);
  res.status(204).json({ message: 'Material deleted successfully' });
});