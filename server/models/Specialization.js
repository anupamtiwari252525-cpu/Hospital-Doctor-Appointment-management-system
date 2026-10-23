const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter specialization name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Stethoscope',
    },
    popularTreatments: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Specialization', specializationSchema);
