const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
