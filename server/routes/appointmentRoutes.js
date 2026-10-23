const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('patient', 'admin'), bookAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/confirm', authorize('doctor', 'admin'), confirmAppointment);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/reschedule', rescheduleAppointment);
router.put('/:id/complete', authorize('doctor', 'admin'), completeAppointment);

module.exports = router;
