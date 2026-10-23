const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please enter your review feedback'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Recalculate doctor average rating after review is saved
reviewSchema.post('save', async function () {
  const Doctor = mongoose.model('Doctor');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { doctorId: this.doctorId } },
    {
      $group: {
        _id: '$doctorId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Doctor.findByIdAndUpdate(this.doctorId, {
      rating: parseFloat(stats[0].avgRating.toFixed(1)),
      totalReviews: stats[0].totalReviews,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
