const userService = require('../services/userService');
const { catchAsync } = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  const { user, token } = await userService.register(req.body);
  res.status(201).json({ user, token });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await userService.login(email, password);
  res.json({ user, token });
});

exports.getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.json(user);
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json(user);
});

exports.changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.id, oldPassword, newPassword);
  res.json(result);
});

exports.deactivateAccount = catchAsync(async (req, res) => {
  const result = await userService.deactivateAccount(req.user.id);
  res.json(result);
});