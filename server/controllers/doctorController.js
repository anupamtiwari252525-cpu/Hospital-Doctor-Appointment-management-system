const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, hospitalId, isVerified, isActive } = req.query;
    const filter = {};

    if (specialization) filter.specialization = specialization;
    if (hospitalId) filter.hospitalId = hospitalId;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone avatar address city pincode isBlocked')
      .populate('hospitalId')
      .sort({ rating: -1, experience: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID with hospital and reviews
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'name email phone avatar address city state pincode')
      .populate('hospitalId');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found with specified ID',
      });
    }

    // Fetch verified reviews for this doctor
    const reviews = await Review.find({ doctorId: doctor._id })
      .populate('patientId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...doctor.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password = 'DoctorPassword123!',
      phone,
      hospitalId,
      qualification,
      specialization,
      experience,
      consultationFee,
      about,
      shift,
      startHour,
      endHour,
      breakStart,
      breakEnd,
      slotDuration,
      availableDays,
    } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password,
        phone: phone || '',
        role: 'doctor',
      });
    } else {
      user.role = 'doctor';
      await user.save();
    }

    const doctor = await Doctor.create({
      userId: user._id,
      hospitalId,
      qualification,
      specialization,
      experience,
      consultationFee,
      about: about || '',
      shift: shift || 'Both',
      startHour: startHour || '09:00 AM',
      endHour: endHour || '05:00 PM',
      breakStart: breakStart || '01:00 PM',
      breakEnd: breakEnd || '02:00 PM',
      slotDuration: slotDuration || 30,
      availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isVerified: true,
      isActive: true,
    });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('userId', 'name email phone avatar')
      .populate('hospitalId');

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile (Admin or the Doctor themselves)
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor)
exports.updateDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Ensure authorized: admin or the doctor user themselves
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doctor profile',
      });
    }

    const {
      qualification,
      specialization,
      experience,
      consultationFee,
      about,
      availableDays,
      shift,
      startHour,
      endHour,
      breakStart,
      breakEnd,
      slotDuration,
      hospitalId,
      isVerified,
      isActive,
    } = req.body;

    const updates = {};
    if (qualification !== undefined) updates.qualification = qualification;
    if (specialization !== undefined) updates.specialization = specialization;
    if (experience !== undefined) updates.experience = experience;
    if (consultationFee !== undefined) updates.consultationFee = consultationFee;
    if (about !== undefined) updates.about = about;
    if (availableDays !== undefined) updates.availableDays = availableDays;
    if (shift !== undefined) updates.shift = shift;
    if (startHour !== undefined) updates.startHour = startHour;
    if (endHour !== undefined) updates.endHour = endHour;
    if (breakStart !== undefined) updates.breakStart = breakStart;
    if (breakEnd !== undefined) updates.breakEnd = breakEnd;
    if (slotDuration !== undefined) updates.slotDuration = slotDuration;
    if (hospitalId !== undefined && req.user.role === 'admin') updates.hospitalId = hospitalId;
    if (isVerified !== undefined && req.user.role === 'admin') updates.isVerified = isVerified;
    if (isActive !== undefined && req.user.role === 'admin') updates.isActive = isActive;

    doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email phone avatar')
      .populate('hospitalId');

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle doctor verification (Admin only)
// @route   PUT /api/doctors/:id/verify
// @access  Private/Admin
exports.toggleVerifyDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    doctor.isVerified = !doctor.isVerified;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor verification status updated to ${doctor.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
      isVerified: doctor.isVerified,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle doctor active status (Admin only)
// @route   PUT /api/doctors/:id/status
// @access  Private/Admin
exports.toggleDoctorStatus = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor status updated to ${doctor.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      isActive: doctor.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current doctor's clinical profile & summary stats
// @route   GET /api/doctors/me/profile
// @access  Private/Doctor
exports.getMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone avatar address city pincode')
      .populate('hospitalId');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found for logged in user',
      });
    }

    const totalAppointments = await Appointment.countDocuments({ doctorId: doctor._id });
    const pendingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'pending',
    });
    const completedAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      status: 'completed',
    });

    res.status(200).json({
      success: true,
      data: {
        ...doctor.toObject(),
        stats: {
          totalAppointments,
          pendingAppointments,
          completedAppointments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
