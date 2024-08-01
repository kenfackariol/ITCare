const Breakdown = require('@src/models/Breakdown');
const Material = require('@src/models/Material');
const User = require('@src/models/User');
const { sequelize } = require('@src/config/database');
const applyAssociations = require('@src/utils/associations');

describe('Breakdown Model', () => {
    let breakdown;
    let material;
    let user;
  
    beforeAll(async () => {
      applyAssociations();
    });
  
    afterEach(async () => {
      await Breakdown.destroy({ where: {} });
      await Material.destroy({ where: {} });
      await User.destroy({ where: {} });
    });
  
    afterAll(async () => {
      await sequelize.close();
    });
  
    beforeEach(async () => {
      material = await Material.create({
        name: 'Steel',
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      user = await User.create({
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      breakdown = await Breakdown.create({
        name_requester: 'John Doe',
        materialId: material.id,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  
    it('should create a valid breakdown', async () => {
      await breakdown.validate();
      expect(breakdown).toBeTruthy();
      expect(breakdown.name_requester).toBe('John Doe');
    });
  
    it('should not create a breakdown with null name_requester', async () => {
      breakdown.name_requester = null;
      await expect(breakdown.validate()).rejects.toThrow('notNull Violation: Breakdown.name_requester cannot be null');
    });
  
    it('should calculate duration correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');
      breakdown.start_date_intervention = startDate;
      breakdown.end_date_intervention = endDate;
      await breakdown.save();
  
      const duration = breakdown.getDuration();
      const expectedDuration = endDate - startDate; // Calculate duration directly
      expect(duration).toBe(expectedDuration);
    });
  
    it('should return full details including material and user', async () => {
      const fullDetails = await breakdown.getFullDetails();
      expect(fullDetails).toHaveProperty('name_requester');
      expect(fullDetails).toHaveProperty('material');
      expect(fullDetails).toHaveProperty('user');
      expect(fullDetails.material).not.toBeNull();
      expect(fullDetails.user).not.toBeNull();
    });
  
    it('should update a breakdown correctly', async () => {
      const newName = 'Jane Doe';
      breakdown.name_requester = newName;
      await breakdown.save();
      
      const updatedBreakdown = await Breakdown.findByPk(breakdown.id);
      expect(updatedBreakdown.name_requester).toBe(newName);
    });
  
    it('should delete a breakdown correctly', async () => {
      await breakdown.destroy();
      
      const deletedBreakdown = await Breakdown.findByPk(breakdown.id);
      expect(deletedBreakdown).toBeNull();
    });
  });