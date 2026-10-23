const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    timeSlot: {
      type: String, // e.g. "10:30 AM"
      required: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    rescheduledHistory: [
      {
        previousDate: String,
        previousSlot: String,
        rescheduledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'paid',
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    hasPrescription: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
