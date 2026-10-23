const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const { sendNotification } = require('../utils/notificationHelper');

// Helper to generate unique appointment number
function generateAppointmentNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  return `APT-${timestamp}-${random}`;
}

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, symptoms, notes } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide doctorId, date (YYYY-MM-DD), and timeSlot.',
      });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name').populate('hospitalId');
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or currently not available for bookings.',
      });
    }

    // Strict Shift Restriction Check:
    // If doctor shift is 'Morning', strictly permit only morning slots
    // If doctor shift is 'Evening', strictly permit only evening slots
    const isPM = timeSlot.includes('PM');
    const isNoon = timeSlot.startsWith('12:');
    const isEvening = isPM && !isNoon;

    const docName = doctor.userId?.name
      ? `Dr. ${doctor.userId.name.replace(/^(dr\.?\s*)+/i, '')}`
      : 'this doctor';

    if (doctor.shift === 'Morning' && isEvening) {
      return res.status(400).json({
        success: false,
        message: `Shift Conflict: ${docName} is strictly available for Morning Shift only (09:00 AM - 01:00 PM). Please select an available morning slot.`,
      });
    }

    if (doctor.shift === 'Evening' && !isEvening) {
      return res.status(400).json({
        success: false,
        message: `Shift Conflict: ${docName} is strictly available for Evening Shift only (02:00 PM - 08:00 PM). Please select an available evening slot.`,
      });
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: `The time slot ${timeSlot} on ${date} is already booked. Please choose another slot.`,
      });
    }

    const appointmentNumber = generateAppointmentNumber();

    const appointment = await Appointment.create({
      appointmentNumber,
      patientId: req.user.id,
      doctorId,
      hospitalId: doctor.hospitalId._id,
      date,
      timeSlot,
      symptoms: symptoms || '',
      notes: notes || '',
      fee: doctor.consultationFee,
      status: 'pending',
      paymentStatus: 'paid',
    });

    // Update the slot inside Availability collection
    await Availability.findOneAndUpdate(
      { doctorId, date, 'slots.time': timeSlot },
      {
        $set: {
          'slots.$.isBooked': true,
          'slots.$.appointmentId': appointment._id,
        },
      }
    );

    // Send notifications to Patient and Doctor
    const patientNotifDocName = doctor.userId?.name
      ? `Dr. ${doctor.userId.name.replace(/^(dr\.?\s*)+/i, '')}`
      : 'the doctor';

    await sendNotification({
      userId: req.user.id,
      type: 'appointment_booked',
      title: 'Appointment Booked Successfully',
      message: `Your appointment (#${appointmentNumber}) with ${patientNotifDocName} for ${date} at ${timeSlot} has been placed and is awaiting doctor confirmation.`,
      link: `/patient/appointments`,
    });

    await sendNotification({
      userId: doctor.userId._id,
      type: 'appointment_booked',
      title: 'New Appointment Booking Request',
      message: `Patient ${req.user.name} has booked an appointment (#${appointmentNumber}) on ${date} at ${timeSlot}.`,
      link: `/doctor/appointments`,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email phone avatar address city pincode')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone avatar' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments list (Role filtered)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, date, doctorId, patientId } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date) {
      filter.date = date;
    }

    // Role-based filtering
    if (req.user.role === 'patient') {
      filter.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: 'Doctor clinical profile not found',
        });
      }
      filter.doctorId = doctorProfile._id;
    } else if (req.user.role === 'admin') {
      if (doctorId) filter.doctorId = doctorId;
      if (patientId) filter.patientId = patientId;
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'name email phone avatar pincode city address')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone avatar' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone avatar address city pincode')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone avatar' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm appointment (Doctor or Admin)
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Doctor/Admin)
exports.confirmAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    const confirmDocName = appointment.doctorId?.userId?.name
      ? `Dr. ${appointment.doctorId.userId.name.replace(/^(dr\.?\s*)+/i, '')}`
      : 'The doctor';

    await sendNotification({
      userId: appointment.patientId._id,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Great news! ${confirmDocName} has confirmed your appointment (#${appointment.appointmentNumber}) for ${appointment.date} at ${appointment.timeSlot}.`,
      link: `/patient/appointments`,
    });

    res.status(200).json({
      success: true,
      message: 'Appointment confirmed successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled.',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Free the slot in Availability
    await Availability.findOneAndUpdate(
      { doctorId: appointment.doctorId._id, date: appointment.date, 'slots.time': appointment.timeSlot },
      {
        $set: {
          'slots.$.isBooked': false,
          'slots.$.appointmentId': null,
        },
      }
    );

    // Notify patient & doctor
    await sendNotification({
      userId: appointment.patientId._id,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment #${appointment.appointmentNumber} on ${appointment.date} was cancelled. Reason: ${reason}`,
      link: `/patient/appointments`,
    });

    await sendNotification({
      userId: appointment.doctorId.userId._id,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment #${appointment.appointmentNumber} on ${appointment.date} at ${appointment.timeSlot} was cancelled.`,
      link: `/doctor/appointments`,
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { newDate, newTimeSlot } = req.body;

    if (!newDate || !newTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide newDate and newTimeSlot',
      });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' },
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if new slot is free
    const conflict = await Appointment.findOne({
      doctorId: appointment.doctorId._id,
      date: newDate,
      timeSlot: newTimeSlot,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: appointment._id },
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `The selected slot ${newTimeSlot} on ${newDate} is already taken.`,
      });
    }

    // Free old slot
    await Availability.findOneAndUpdate(
      { doctorId: appointment.doctorId._id, date: appointment.date, 'slots.time': appointment.timeSlot },
      {
        $set: {
          'slots.$.isBooked': false,
          'slots.$.appointmentId': null,
        },
      }
    );

    // Book new slot
    await Availability.findOneAndUpdate(
      { doctorId: appointment.doctorId._id, date: newDate, 'slots.time': newTimeSlot },
      {
        $set: {
          'slots.$.isBooked': true,
          'slots.$.appointmentId': appointment._id,
        },
      }
    );

    appointment.rescheduledHistory.push({
      previousDate: appointment.date,
      previousSlot: appointment.timeSlot,
    });
    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'rescheduled';
    await appointment.save();

    await sendNotification({
      userId: appointment.patientId._id,
      type: 'appointment_rescheduled',
      title: 'Appointment Rescheduled',
      message: `Your appointment #${appointment.appointmentNumber} has been rescheduled to ${newDate} at ${newTimeSlot}.`,
      link: `/patient/appointments`,
    });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark appointment completed
// @route   PUT /api/appointments/:id/complete
// @access  Private (Doctor or Admin)
exports.completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment completed successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};
