const materialService = require('../services/materialService');
const { catchAsync } = require('../utils/catchAsync');

exports.createMaterial = catchAsync(async (req, res) => {
    const material = await materialService.createMaterial(req.body);
    res.status(201).json(material);
});

exports.getAllMaterials = catchAsync(async (req, res) => {
    const materials = await materialService.getAllMaterials();
    res.status(200).json(materials);
});

exports.getMaterialById = catchAsync(async (req, res) => {
    const material = await materialService.readMaterial(req.params.id);
    res.status(200).json(material);
});

exports.updateMaterial = catchAsync(async (req, res) => {
    const material = await materialService.updateMaterial(req.params.id, req.body);
    res.status(200).json(material);
});

exports.deleteMaterial = catchAsync(async (req, res) => {
    await materialService.deleteMaterial(req.params.id);
    res.status(204).end();
});
