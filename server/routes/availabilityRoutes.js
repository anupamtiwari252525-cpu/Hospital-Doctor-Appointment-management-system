const express = require('express');
const router = express.Router();
const {
  getDoctorAvailability,
  setAvailability,
  getUpcomingDays,
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/doctor/:doctorId', getDoctorAvailability);
router.get('/upcoming/:doctorId', getUpcomingDays);
router.post('/set', protect, authorize('doctor', 'admin'), setAvailability);

module.exports = router;
