const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.use(protect); // All routes below this line require authentication

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.delete('/deactivate', userController.deactivateAccount);

// Admin only route example
router.get('/all', restrictTo('admin'), (req, res) => {
  // Fetch all users logic here
});

module.exports = router;