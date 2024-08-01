const MaterialService = require('@src/services/materialService');
const Material = require('@src/models/Material');
const AppError = require('@src/utils/appError');

// Mock the Material model
jest.mock('@src/models/Material');

describe('MaterialService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('readMaterial', () => {
        it('should return a material by ID', async () => {
            const material = { id: 1, name: 'Steel' };

            // Mock the Material.findByPk method to return a material
            Material.findByPk.mockResolvedValue(material);

            const result = await MaterialService.readMaterial(1);

            expect(Material.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(material);
        });

        it('should throw an error if material is not found', async () => {
            // Mock Material.findByPk method to return null
            Material.findByPk.mockResolvedValue(null);

            await expect(MaterialService.readMaterial(1))
                .rejects
                .toBeInstanceOf(AppError);  // Check that the error is an instance of AppError

            await expect(MaterialService.readMaterial(1))
                .rejects
                .toHaveProperty('statusCode', 404);  // Check the statusCode

            await expect(MaterialService.readMaterial(1))
                .rejects
                .toHaveProperty('message', 'Material not found');  // Check the error message
        });
    });

    describe('createMaterial', () => {
        it('should create a material and return it', async () => {
            const data = { name: 'Steel' };
            const material = { id: 1, name: 'Steel', createdAt: new Date(), updatedAt: new Date() };

            // Mock Material.create method
            Material.create.mockResolvedValue(material);

            const result = await MaterialService.createMaterial(data);

            expect(Material.create).toHaveBeenCalledWith({
                ...data,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(result).toEqual(material);
        });

        it('should throw an error if validation fails', async () => {
            const invalidData = { name: '' };  // Invalid data

            await expect(MaterialService.createMaterial(invalidData))
                .rejects
                .toBeInstanceOf(AppError);

            await expect(MaterialService.createMaterial(invalidData))
                .rejects
                .toHaveProperty('statusCode', 400);

            await expect(MaterialService.createMaterial(invalidData))
                .rejects
                .toHaveProperty('message', '\"name\" is not allowed to be empty');  // Example validation error message
        });
    });

    describe('updateMaterial', () => {
        it('should update a material', async () => {
            const id = 1;
            const data = { name: 'Aluminum' };
    
            const mockMaterial = {
                update: jest.fn().mockResolvedValue({
                    id: 1,
                    name: 'Aluminum',
                    updatedAt: expect.any(String)
                })
            };
    
            Material.findByPk.mockResolvedValue(mockMaterial);
    
            const result = await MaterialService.updateMaterial(id, data);
    
            expect(Material.findByPk).toHaveBeenCalledWith(id);
            expect(mockMaterial.update).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Aluminum'
            }));
            
            // Check that result is the mock material instance
            expect(result).toEqual(mockMaterial);
        });

        it('should throw an error if material is not found for update', async () => {
            const id = 1;
            const data = { name: 'Aluminum' };

            Material.findByPk.mockResolvedValue(null);

            await expect(MaterialService.updateMaterial(id, data))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('deleteMaterial', () => {
        it('should delete a material and return a success message', async () => {
            const id = 1;
            const material = { id: 1, name: 'Steel', destroy: jest.fn().mockResolvedValue() };

            // Mock Material.findByPk method
            Material.findByPk.mockResolvedValue(material);

            const result = await MaterialService.deleteMaterial(id);

            expect(Material.findByPk).toHaveBeenCalledWith(id);
            expect(material.destroy).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Material deleted successfully' });
        });

        it('should throw an error if material is not found for deletion', async () => {
            // Mock Material.findByPk method to return null
            Material.findByPk.mockResolvedValue(null);

            await expect(MaterialService.deleteMaterial(1))
                .rejects
                .toBeInstanceOf(AppError);

            await expect(MaterialService.deleteMaterial(1))
                .rejects
                .toHaveProperty('statusCode', 404);

            await expect(MaterialService.deleteMaterial(1))
                .rejects
                .toHaveProperty('message', 'Material not found');
        });
    });

    describe('getAllMaterials', () => {
        it('should return all materials', async () => {
            const materials = [{ id: 1, name: 'Steel' }];

            // Mock Material.findAll method
            Material.findAll.mockResolvedValue(materials);

            const result = await MaterialService.getAllMaterials();

            expect(Material.findAll).toHaveBeenCalled();
            expect(result).toEqual(materials);
        });
    });
});
