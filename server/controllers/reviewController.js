const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Add review for a completed appointment
// @route   POST /api/reviews
// @access  Private/Patient
exports.createReview = async (req, res, next) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointmentId, rating (1-5), and feedback comment.',
      });
    }

    const appointment = await Appointment.findById(appointmentId).populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name' },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check permission
    if (appointment.patientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own appointments.',
      });
    }

    // STRICT RULE: Only Completed Appointment can be Reviewed
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed appointments can be reviewed. Your appointment status is currently: ' + appointment.status,
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ appointmentId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this appointment.',
      });
    }

    const review = await Review.create({
      appointmentId,
      patientId: req.user.id,
      doctorId: appointment.doctorId._id,
      rating: Number(rating),
      comment,
    });

    appointment.isReviewed = true;
    await appointment.save();

    await sendNotification({
      userId: appointment.doctorId.userId._id,
      type: 'review_received',
      title: 'New Patient Review Received',
      message: `${req.user.name} gave you a ${rating}-star review: "${comment.slice(0, 50)}..."`,
      link: `/doctor/reviews`,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('patientId', 'name avatar')
      .populate('doctorId');

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a doctor
// @route   GET /api/reviews/doctor/:doctorId
// @access  Public
exports.getDoctorReviews = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.find({ doctorId })
      .populate('patientId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
