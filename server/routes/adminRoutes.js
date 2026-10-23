const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserBlock,
  getSpecializations,
  createSpecialization,
  deleteSpecialization,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/specializations', getSpecializations);

// Protected Admin-only routes
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserBlock);
router.post('/specializations', createSpecialization);
router.delete('/specializations/:id', deleteSpecialization);

module.exports = router;
