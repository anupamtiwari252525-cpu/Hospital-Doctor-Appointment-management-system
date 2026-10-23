const express = require('express');
const router = express.Router();
const {
  searchDoctors,
  getPincodes,
  searchHospitals,
} = require('../controllers/searchController');

router.get('/doctors', searchDoctors);
router.get('/pincodes', getPincodes);
router.get('/hospitals', searchHospitals);

module.exports = router;
