const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter hospital name'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Please enter contact number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please enter hospital address'],
    },
    area: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'Please enter city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please enter state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please enter pincode'],
      trim: true,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.2090, 28.6139],
      },
    },
    departments: [
      {
        type: String,
        trim: true,
      },
    ],
    facilities: [
      {
        type: String,
        trim: true,
      },
    ],
    openingHours: {
      type: String,
      default: '24 Hours Emergency / OPD 08:00 AM - 08:00 PM',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ pincode: 1, city: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
