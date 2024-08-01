const User = require('@src/models/User');
const bcrypt = require('bcryptjs');
const { sequelize } = require('@src/config/database');

describe('User Model', () => {
  let user;

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close(); // Ensure all connections are closed
  });

  beforeEach(() => {
    user = User.build({
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  it('should create a valid user', async () => {
    await user.validate();
    expect(user).toBeTruthy();
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('user');
    expect(user.isActive).toBe(true);
  });

  it('should not create a user with invalid email', async () => {
    user.email = 'invalid-email';
    await expect(user.validate()).rejects.toThrow('Email address must be valid');
  });

  it('should not create a user with null email', async () => {
    user.email = null;
    await expect(user.validate()).rejects.toThrow('Email is required');
  });

  it('should not create a user with short password', async () => {
    user.password = 'short';
    await expect(user.validate()).rejects.toThrow('Password must be between 8 and 100 characters long');
  });

  it('should hash password before create', async () => {
    const plainPassword = 'password123';
    user.password = plainPassword;
    const savedUser = await user.save();
    expect(savedUser.password).not.toBe(plainPassword);
    expect(await bcrypt.compare(plainPassword, savedUser.password)).toBe(true);
  });

  it('should hash password before update', async () => {
    await user.save();
    const newPassword = 'newpassword123';
    user.password = newPassword;
    await user.save();
    expect(user.password).not.toBe(newPassword);
    expect(await bcrypt.compare(newPassword, user.password)).toBe(true);
  });

  it('should find user by email', async () => {
    await user.save();
    const foundUser = await User.findByEmail(user.email);
    expect(foundUser).toBeTruthy();
    expect(foundUser.email).toBe(user.email);
  });

  it('should validate password', async () => {
    const plainPassword = 'password123';
    user.password = plainPassword;
    await user.save();
    expect(await user.isValidPassword(plainPassword)).toBe(true);
    expect(await user.isValidPassword('wrongpassword')).toBe(false);
  });

  it('should not return password in JSON representation', () => {
    const jsonUser = user.toJSON();
    expect(jsonUser).not.toHaveProperty('password');
  });

  it('should set default role to user', () => {
    const newUser = User.build({ email: 'new@example.com', password: 'password123' });
    expect(newUser.role).toBe('user');
  });

  it('should set isActive to true by default', () => {
    const newUser = User.build({ email: 'new@example.com', password: 'password123' });
    expect(newUser.isActive).toBe(true);
  });

  it('should not create a user with an invalid role', async () => {
    user.role = 'invalid-role';
    await expect(user.save()).rejects.toThrow('Validation error: Role must be user or admin');
  });
  
  
  it('should not create a user with a duplicate email', async () => {
    await user.save();
    const duplicateUser = User.build({
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await expect(duplicateUser.save()).rejects.toThrow('Validation error');
  });
  
  it('should set isActive to false when soft deleted', async () => {
    await user.save();
    user.isActive = false;
    await user.save();
    expect(user.isActive).toBe(false);
  });  
});
