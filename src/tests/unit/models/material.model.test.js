const Material = require('@src/models/Material');
const Breakdown = require('@src/models/Breakdown');
const User = require('@src/models/User');
const { sequelize } = require('@src/config/database');
const applyAssociations = require('@src/utils/associations');

describe('Material Model', () => {
  let material;
  let breakdown;
  let user;

  beforeAll(async () => {
    // Import and apply associations for tests
    applyAssociations();
  });

  afterEach(async () => {
    // Cleanup test data
    await Breakdown.destroy({ where: {} });
    await Material.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    // Close the connection
    await sequelize.close();
  });

  beforeEach(async () => {
    // Create associated data
    user = await User.create({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    material = await Material.create({
      name: 'Steel',
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

  it('should create a valid material', async () => {
    await material.validate();
    expect(material).toBeTruthy();
    expect(material.name).toBe('Steel');
  });

  it('should return full details including breakdowns', async () => {
    const fullDetails = await material.getFullDetails();
    expect(fullDetails).toHaveProperty('name');
    expect(fullDetails).toHaveProperty('breakdowns');
    expect(fullDetails.breakdowns).toBeInstanceOf(Array);
    expect(fullDetails.breakdowns.length).toBeGreaterThan(0);
    expect(fullDetails.breakdowns[0].name_requester).toBe('John Doe');
  });

  it('should update a material correctly', async () => {
    const newName = 'Aluminum';
    material.name = newName;
    await material.save();

    const updatedMaterial = await Material.findByPk(material.id);
    expect(updatedMaterial.name).toBe(newName);
  });

  it('should delete a material correctly', async () => {
    await material.destroy();

    const deletedMaterial = await Material.findByPk(material.id);
    expect(deletedMaterial).toBeNull();
  });
});
