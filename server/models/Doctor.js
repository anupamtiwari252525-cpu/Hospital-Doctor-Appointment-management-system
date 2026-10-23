const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    medicalLicenseNumber: {
      type: String,
      trim: true,
      default: '',
    },
    qualification: {
      type: String,
      required: [true, 'Please provide doctor qualification (e.g., MBBS, MD, MS)'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please specify doctor specialization'],
      trim: true,
      index: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please enter years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please enter consultation fee'],
      min: [0, 'Fee cannot be negative'],
    },
    about: {
      type: String,
      default: '',
    },
    awards: [
      {
        type: String,
        trim: true,
      },
    ],
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Both'],
      default: 'Both',
    },
    startHour: {
      type: String,
      default: '09:00 AM',
    },
    endHour: {
      type: String,
      default: '05:00 PM',
    },
    breakStart: {
      type: String,
      default: '01:00 PM',
    },
    breakEnd: {
      type: String,
      default: '02:00 PM',
    },
    slotDuration: {
      type: Number,
      default: 30, // in minutes
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ specialization: 1, consultationFee: 1, rating: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
