const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Add consultation & digital prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
exports.createPrescription = async (req, res, next) => {
  try {
    const {
      appointmentId,
      symptoms,
      diagnosis,
      doctorNotes,
      medicines,
      testsRecommended,
      dietaryAdvice,
      followUpDate,
    } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name' },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Verify authorized doctor
    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (
      req.user.role !== 'admin' &&
      (!doctorProfile || doctorProfile._id.toString() !== appointment.doctorId._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create prescription for this appointment',
      });
    }

    // Create or update prescription
    let prescription = await Prescription.findOne({ appointmentId });
    if (prescription) {
      prescription.symptoms = symptoms || prescription.symptoms;
      prescription.diagnosis = diagnosis || prescription.diagnosis;
      prescription.doctorNotes = doctorNotes || prescription.doctorNotes;
      prescription.medicines = medicines || prescription.medicines;
      prescription.testsRecommended = testsRecommended || prescription.testsRecommended;
      prescription.dietaryAdvice = dietaryAdvice || prescription.dietaryAdvice;
      prescription.followUpDate = followUpDate || prescription.followUpDate;
      await prescription.save();
    } else {
      prescription = await Prescription.create({
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId._id,
        hospitalId: appointment.hospitalId,
        symptoms: symptoms || appointment.symptoms || '',
        diagnosis,
        doctorNotes: doctorNotes || '',
        medicines: medicines || [],
        testsRecommended: testsRecommended || [],
        dietaryAdvice: dietaryAdvice || '',
        followUpDate: followUpDate || '',
      });
    }

    // Mark appointment as completed and with prescription
    appointment.status = 'completed';
    appointment.hasPrescription = true;
    await appointment.save();

    const rxDocName = appointment.doctorId?.userId?.name
      ? `Dr. ${appointment.doctorId.userId.name.replace(/^(dr\.?\s*)+/i, '')}`
      : 'Your physician';

    await sendNotification({
      userId: appointment.patientId,
      type: 'prescription_added',
      title: 'Digital Prescription Available',
      message: `${rxDocName} has issued your prescription for appointment #${appointment.appointmentNumber}.`,
      link: `/patient/prescriptions`,
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patientId', 'name email phone avatar address city pincode')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId');

    res.status(201).json({
      success: true,
      message: 'Prescription created and appointment completed',
      data: populatedPrescription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescription by appointment ID
// @route   GET /api/prescriptions/appointment/:appointmentId
// @access  Private
exports.getPrescriptionByAppointment = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      appointmentId: req.params.appointmentId,
    })
      .populate('patientId', 'name email phone avatar address city pincode')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'No prescription found for this appointment',
      });
    }

    res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient prescription history
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private
exports.getPatientPrescriptions = async (req, res, next) => {
  try {
    const patientId = req.params.patientId || req.user.id;
    const prescriptions = await Prescription.find({ patientId })
      .populate('patientId', 'name email phone')
      .populate({
        path: 'doctorId',
        populate: [{ path: 'userId', select: 'name email phone' }, { path: 'hospitalId' }],
      })
      .populate('hospitalId')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    next(error);
  }
};
