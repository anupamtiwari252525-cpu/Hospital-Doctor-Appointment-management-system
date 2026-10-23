const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const { getPincodeInfo } = require('../utils/pincodeHelper');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
exports.getAllHospitals = async (req, res, next) => {
  try {
    const { pincode, city, department, isActive } = req.query;
    const filter = {};

    if (pincode) filter.pincode = pincode.toString().trim();
    if (city) filter.city = new RegExp(city, 'i');
    if (department) filter.departments = department;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const hospitals = await Hospital.find(filter).sort({ rating: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hospital by ID along with affiliated doctors
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found with specified ID',
      });
    }

    // Find doctors affiliated with this hospital
    const doctors = await Doctor.find({ hospitalId: hospital._id, isActive: true })
      .populate('userId', 'name email phone avatar')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...hospital.toObject(),
        doctors,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hospital (Admin only)
// @route   POST /api/hospitals
// @access  Private/Admin
exports.createHospital = async (req, res, next) => {
  try {
    const {
      name,
      email,
      contactNumber,
      address,
      area,
      city,
      state,
      pincode,
      departments,
      facilities,
      openingHours,
      image,
    } = req.body;

    // Check pincode metadata for geo coordinates
    const pincodeMeta = getPincodeInfo(pincode);
    let coordinates = [77.2090, 28.6139]; // Default coordinates
    if (pincodeMeta) {
      coordinates = [pincodeMeta.lng, pincodeMeta.lat];
    }

    const hospital = await Hospital.create({
      name,
      email: email || '',
      contactNumber,
      address,
      area: area || (pincodeMeta ? pincodeMeta.area : ''),
      city: city || (pincodeMeta ? pincodeMeta.city : ''),
      state: state || (pincodeMeta ? pincodeMeta.state : ''),
      pincode: pincode.toString().trim(),
      location: {
        type: 'Point',
        coordinates,
      },
      departments: departments || ['Cardiology', 'Neurology', 'Orthopedics', 'General Medicine'],
      facilities: facilities || ['24/7 Emergency', 'ICU', 'Radiology / MRI', 'Pharmacy', 'Pathology Lab'],
      openingHours: openingHours || '24 Hours Emergency / OPD 08:00 AM - 08:00 PM',
      image: image || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Hospital created successfully',
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hospital details (Admin only)
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
exports.updateHospital = async (req, res, next) => {
  try {
    const {
      name,
      email,
      contactNumber,
      address,
      area,
      city,
      state,
      pincode,
      departments,
      facilities,
      openingHours,
      image,
      isActive,
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (contactNumber) updates.contactNumber = contactNumber;
    if (address) updates.address = address;
    if (area !== undefined) updates.area = area;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (pincode) {
      updates.pincode = pincode.toString().trim();
      const pincodeMeta = getPincodeInfo(pincode);
      if (pincodeMeta) {
        updates.location = {
          type: 'Point',
          coordinates: [pincodeMeta.lng, pincodeMeta.lat],
        };
      }
    }
    if (departments) updates.departments = departments;
    if (facilities) updates.facilities = facilities;
    if (openingHours) updates.openingHours = openingHours;
    if (image) updates.image = image;
    if (isActive !== undefined) updates.isActive = isActive;

    const hospital = await Hospital.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hospital updated successfully',
      data: hospital,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate hospital (Admin only)
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    // Soft delete by setting isActive to false
    hospital.isActive = false;
    await hospital.save();

    res.status(200).json({
      success: true,
      message: 'Hospital deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};
