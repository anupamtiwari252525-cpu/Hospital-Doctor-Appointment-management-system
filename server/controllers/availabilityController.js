const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { generateTimeSlots } = require('../utils/slotGenerator');

// Helper to get day name from YYYY-MM-DD
function getDayName(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// @desc    Get doctor availability & slots for a specific date
// @route   GET /api/availability/doctor/:doctorId
// @access  Public
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    let { date } = req.query; // YYYY-MM-DD

    if (!date) {
      const today = new Date();
      date = today.toISOString().split('T')[0];
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const dayName = getDayName(date);
    const isDoctorWorkingDay = doctor.availableDays.includes(dayName);

    // Look for existing availability record for this date
    let availability = await Availability.findOne({ doctorId, date });

    if (!availability) {
      // Auto-generate availability from doctor default schedule
      if (!isDoctorWorkingDay) {
        return res.status(200).json({
          success: true,
          date,
          dayOfWeek: dayName,
          isAvailable: false,
          leaveReason: `Doctor is not available on ${dayName}s.`,
          slots: [],
        });
      }

      const generatedSlots = generateTimeSlots(
        doctor.startHour,
        doctor.endHour,
        doctor.slotDuration,
        doctor.breakStart,
        doctor.breakEnd
      );

      // Check if any existing appointments are already booked on this date & doctor
      const existingAppointments = await Appointment.find({
        doctorId,
        date,
        status: { $in: ['pending', 'confirmed'] },
      });

      const bookedSlotsMap = {};
      existingAppointments.forEach((apt) => {
        bookedSlotsMap[apt.timeSlot] = apt._id;
      });

      const slotsWithBooking = generatedSlots.map((slot) => ({
        time: slot.time,
        isBooked: !!bookedSlotsMap[slot.time],
        appointmentId: bookedSlotsMap[slot.time] || null,
      }));

      availability = await Availability.create({
        doctorId,
        date,
        dayOfWeek: dayName,
        shift: doctor.shift,
        startTime: doctor.startHour,
        endTime: doctor.endHour,
        breakStartTime: doctor.breakStart,
        breakEndTime: doctor.breakEnd,
        slotDuration: doctor.slotDuration,
        slots: slotsWithBooking,
        isAvailable: true,
      });
    } else {
      // Re-verify against any booked appointments to make sure slot status is fresh
      const existingAppointments = await Appointment.find({
        doctorId,
        date,
        status: { $in: ['pending', 'confirmed'] },
      });

      const bookedSlotsMap = {};
      existingAppointments.forEach((apt) => {
        bookedSlotsMap[apt.timeSlot] = apt._id;
      });

      let updated = false;
      availability.slots.forEach((slot) => {
        const shouldBeBooked = !!bookedSlotsMap[slot.time];
        if (slot.isBooked !== shouldBeBooked) {
          slot.isBooked = shouldBeBooked;
          slot.appointmentId = bookedSlotsMap[slot.time] || null;
          updated = true;
        }
      });

      if (updated) {
        await availability.save();
      }
    }

    // Strict Shift Slot Filtering:
    // If doctor is on 'Morning' shift, only expose morning slots
    // If doctor is on 'Evening' shift, only expose evening slots
    let slotsResponse = availability.slots || [];
    if (doctor.shift === 'Morning') {
      slotsResponse = slotsResponse.filter((s) => {
        const isPM = s.time.includes('PM');
        const isNoon = s.time.startsWith('12:');
        return !isPM || isNoon;
      });
    } else if (doctor.shift === 'Evening') {
      slotsResponse = slotsResponse.filter((s) => {
        const isPM = s.time.includes('PM');
        const isNoon = s.time.startsWith('12:');
        return isPM && !isNoon;
      });
    }

    const availabilityObj = availability.toObject ? availability.toObject() : { ...availability };
    availabilityObj.slots = slotsResponse;

    res.status(200).json({
      success: true,
      data: availabilityObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set custom doctor availability / regenerate slots
// @route   POST /api/availability/set
// @access  Private (Doctor or Admin)
exports.setAvailability = async (req, res, next) => {
  try {
    const {
      doctorId,
      date, // YYYY-MM-DD
      shift = 'Both',
      startTime = '09:00 AM',
      endTime = '05:00 PM',
      breakStartTime = '01:00 PM',
      breakEndTime = '02:00 PM',
      slotDuration = 30,
      isAvailable = true,
      leaveReason = '',
    } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change availability for this doctor',
      });
    }

    const dayName = getDayName(date);
    let slots = [];

    if (isAvailable) {
      slots = generateTimeSlots(
        startTime,
        endTime,
        slotDuration,
        breakStartTime,
        breakEndTime
      );

      // Preserve already booked appointments
      const existingAppointments = await Appointment.find({
        doctorId,
        date,
        status: { $in: ['pending', 'confirmed'] },
      });

      const bookedSlotsMap = {};
      existingAppointments.forEach((apt) => {
        bookedSlotsMap[apt.timeSlot] = apt._id;
      });

      slots = slots.map((s) => ({
        time: s.time,
        isBooked: !!bookedSlotsMap[s.time],
        appointmentId: bookedSlotsMap[s.time] || null,
      }));
    }

    const availability = await Availability.findOneAndUpdate(
      { doctorId, date },
      {
        doctorId,
        date,
        dayOfWeek: dayName,
        shift,
        startTime,
        endTime,
        breakStartTime,
        breakEndTime,
        slotDuration,
        slots,
        isAvailable,
        leaveReason,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Availability schedule updated successfully',
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get next 7 days availability overview for quick booking calendar
// @route   GET /api/availability/upcoming/:doctorId
// @access  Public
exports.getUpcomingDays = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const upcoming = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dateStr = nextDate.toISOString().split('T')[0];
      const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' });
      const isWorkingDay = doctor.availableDays.includes(dayName);

      const record = await Availability.findOne({ doctorId, date: dateStr });
      const isAvailable = record ? record.isAvailable : isWorkingDay;

      upcoming.push({
        date: dateStr,
        dayName,
        isAvailable,
      });
    }

    res.status(200).json({
      success: true,
      data: upcoming,
    });
  } catch (error) {
    next(error);
  }
};
