const User = require('../models/User');
const { generateToken } = require('./tokenService');
const AppError = require('../utils/appError');

class UserService {
  async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    return { user, token };
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user || !(await user.isValidPassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    return { user, token };
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    Object.assign(user, updateData);
    await user.save();

    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!(await user.isValidPassword(oldPassword))) {
      throw new AppError('Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async deactivateAccount(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return { message: 'Account deactivated successfully' };
  }
}

module.exports = new UserService();