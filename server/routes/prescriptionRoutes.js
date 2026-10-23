const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPrescriptionByAppointment,
  getPatientPrescriptions,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('doctor', 'admin'), createPrescription);
router.get('/appointment/:appointmentId', getPrescriptionByAppointment);
router.get('/patient/:patientId?', getPatientPrescriptions);

module.exports = router;
