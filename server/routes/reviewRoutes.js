const express = require('express');
const router = express.Router();
const { createReview, getDoctorReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctor/:doctorId', getDoctorReviews);
router.post('/', protect, createReview);

module.exports = router;
