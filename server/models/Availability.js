const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    time: {
      type: String, // e.g. "09:00 AM"
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: String,
      default: '',
    },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Both'],
      default: 'Both',
    },
    startTime: {
      type: String,
      default: '09:00 AM',
    },
    endTime: {
      type: String,
      default: '05:00 PM',
    },
    breakStartTime: {
      type: String,
      default: '01:00 PM',
    },
    breakEndTime: {
      type: String,
      default: '02:00 PM',
    },
    slotDuration: {
      type: Number,
      default: 30, // in minutes
    },
    slots: [slotSchema],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    leaveReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
