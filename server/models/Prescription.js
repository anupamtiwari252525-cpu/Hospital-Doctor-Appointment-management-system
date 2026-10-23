const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String, // e.g. "500 mg"
      required: true,
    },
    frequency: {
      type: String, // e.g. "1-0-1 (Twice daily after food)"
      required: true,
    },
    duration: {
      type: String, // e.g. "5 Days"
      required: true,
    },
    instructions: {
      type: String, // e.g. "Take after meal with warm water"
      default: '',
    },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
      index: true,
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
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    symptoms: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      required: [true, 'Please provide clinical diagnosis'],
      trim: true,
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    medicines: [medicineSchema],
    testsRecommended: [
      {
        type: String,
        trim: true,
      },
    ],
    dietaryAdvice: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: String, // YYYY-MM-DD
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
