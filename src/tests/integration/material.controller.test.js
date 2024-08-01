const materialController = require('@src/controllers/materialController');
const materialService = require('@src/services/materialService');
const { catchAsync } = require('@src/utils/catchAsync');

// Mock the materialService
jest.mock('@src/services/materialService');

describe('Material Controller', () => {
  // Helper function to mock the response object
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.end = jest.fn().mockReturnThis();
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMaterial', () => {
    it('should create a material and return it with status 201', async () => {
      const req = {
        body: { name: 'Steel' },
      };

      const res = mockResponse();
      const material = { name: 'Steel' };

      // Ensure service is called with only req.body
      materialService.createMaterial.mockResolvedValue(material);

      await materialController.createMaterial(req, res);

      // Updated to match the actual service method
      expect(materialService.createMaterial).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(material);
    });
  });

  describe('getAllMaterials', () => {
    it('should return all materials with status 200', async () => {
      const req = {};
      const res = mockResponse();
      const materials = [{ id: 1, name: 'Steel' }];

      materialService.getAllMaterials.mockResolvedValue(materials);

      await materialController.getAllMaterials(req, res);

      expect(materialService.getAllMaterials).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(materials);
    });
  });

  describe('getMaterialById', () => {
    it('should return a material by ID with status 200', async () => {
      const req = {
        params: { id: 1 }
      };
      const res = mockResponse();
      const material = { id: 1, name: 'Steel' };

      materialService.readMaterial.mockResolvedValue(material);

      await materialController.getMaterialById(req, res);

      expect(materialService.readMaterial).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(material);
    });
  });

  describe('updateMaterial', () => {
    it('should update a material and return it with status 200', async () => {
      const req = {
        params: { id: 1 },
        body: { name: 'Aluminum' }
      };
      const res = mockResponse();
      const updatedMaterial = { id: 1, name: 'Aluminum' };

      materialService.updateMaterial.mockResolvedValue(updatedMaterial);

      await materialController.updateMaterial(req, res);

      expect(materialService.updateMaterial).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedMaterial);
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material and return status 204', async () => {
      const req = {
        params: { id: 1 }
      };
      const res = mockResponse();

      materialService.deleteMaterial.mockResolvedValue();

      await materialController.deleteMaterial(req, res);

      expect(materialService.deleteMaterial).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });
  });
});
