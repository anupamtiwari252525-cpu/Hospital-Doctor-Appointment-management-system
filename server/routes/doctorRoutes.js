const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  toggleVerifyDoctor,
  toggleDoctorStatus,
  getMyDoctorProfile,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.get('/me/profile', protect, authorize('doctor'), getMyDoctorProfile);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctor);
router.put('/:id/verify', protect, authorize('admin'), toggleVerifyDoctor);
router.put('/:id/status', protect, authorize('admin'), toggleDoctorStatus);

module.exports = router;
