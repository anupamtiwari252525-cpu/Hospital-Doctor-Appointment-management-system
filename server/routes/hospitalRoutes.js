const express = require('express');
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllHospitals);
router.get('/:id', getHospitalById);
router.post('/', protect, authorize('admin'), createHospital);
router.put('/:id', protect, authorize('admin'), updateHospital);
router.delete('/:id', protect, authorize('admin'), deleteHospital);

module.exports = router;
