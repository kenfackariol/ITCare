const Joi = require('joi');
const User = require('../models/User');
const { generateToken } = require('./tokenService');
const AppError = require('../utils/appError');

// Define validation schema
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  name: Joi.string(),
  role: Joi.string().valid('user', 'admin').default('user'),
  isActive: Joi.boolean().default(true)
});

// Define update profile schema
const updateProfileSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  role: Joi.string().valid('user', 'admin'),
  isActive: Joi.boolean()
}).min(1);

class UserService {
  async register(userData) {
      // Validate data
      const { error } = userSchema.validate(userData);
      if (error) {
          throw new AppError(error.details[0].message, 400);
      }

      try {
          const existingUser = await User.findOne({ where: { email: userData.email } });
          if (existingUser) {
              throw new AppError('Email already in use', 400);
          }

          const user = await User.create({
              ...userData,
              createdAt: new Date(),
              updatedAt: new Date()
          });
          const token = generateToken(user);

          return { user, token };
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to register user', 500);
          }
      }
  }

  async login(email, password) {
      try {
          const user = await User.findOne({ where: { email } });
          if (!user || !(await user.isValidPassword(password))) {
              throw new AppError('Incorrect email or password', 401);
          }

          user.lastLogin = new Date();
          user.updatedAt = new Date();
          await user.save();

          const token = generateToken(user);

          return { user, token };
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to login', 500);
          }
      }
  }

  async getProfile(userId) {
      try {
          const user = await User.findByPk(userId);
          if (!user) {
              throw new AppError('User not found', 404);
          }
          return user;
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to retrieve user profile', 500);
          }
      }
  }

  async updateProfile(userId, updateData) {
      // Validate data
      const { error } = updateProfileSchema.validate(updateData);
      if (error) {
          throw new AppError(error.details[0].message, 400);
      }

      try {
          const user = await User.findByPk(userId);
          if (!user) {
              throw new AppError('User not found', 404);
          }

          await user.update({
              ...updateData,
              updatedAt: new Date()
          });

          return user;
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to update user profile', 500);
          }
      }
  }

  async changePassword(userId, oldPassword, newPassword) {
      try {
          const user = await User.findByPk(userId);
          if (!user) {
              throw new AppError('User not found', 404);
          }

          if (!(await user.isValidPassword(oldPassword))) {
              throw new AppError('Current password is incorrect', 400);
          }

          user.password = newPassword;
          user.updatedAt = new Date();
          await user.save();

          return { message: 'Password updated successfully' };
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to change password', 500);
          }
      }
  }

  async deactivateAccount(userId) {
      try {
          const user = await User.findByPk(userId);
          if (!user) {
              throw new AppError('User not found', 404);
          }

          user.isActive = false;
          user.updatedAt = new Date();
          await user.save();

          return { message: 'Account deactivated successfully' };
      } catch (error) {
          if (error instanceof AppError) {
              throw error;
          } else {
              throw new AppError('Failed to deactivate account', 500);
          }
      }
  }

  async getAllUsers() {
      try {
          const users = await User.findAll({
              attributes: { exclude: ['password'] },
          });
          return users;
      } catch (error) {
          throw new AppError('Failed to retrieve users', 500);
      }
  }
}

module.exports = new UserService();