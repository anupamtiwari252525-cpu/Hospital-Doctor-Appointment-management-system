import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  FileText,
  MapPin,
  ChevronRight,
  QrCode,
  ShieldCheck,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Wallet,
  Smartphone,
  BadgeCheck,
  Printer,
  Info,
  Lock,
} from 'lucide-react';
import qrCodeImg from '../../assets/payment-qr.jpg';
import { availabilityAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function BookingModal({ doctor, isOpen, onClose, onBookingSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const { fetchNotifications } = useNotifications();

  // Multi-step booking state (1: Schedule Selection, 2: UPI QR Payment)
  const [bookingStep, setBookingStep] = useState(1);
  const [upcomingDays, setUpcomingDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All'); // 'All', 'Morning', 'Evening'
  
  // Payment states
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Initialize next 7 days and strict shift when doctor is selected
  useEffect(() => {
    if (isOpen && doctor) {
      setBookingStep(1);
      setErrorMessage('');
      setBookingSuccessData(null);
      setSelectedSlot('');
      setSymptoms('');
      setNotes('');
      setUtrNumber('');
      setCopiedUpi(false);
      setTimeLeft(600);

      // Lock shift filter strictly to doctor's assigned shift
      if (doctor.shift === 'Morning') {
        setShiftFilter('Morning');
      } else if (doctor.shift === 'Evening') {
        setShiftFilter('Evening');
      } else {
        setShiftFilter('All');
      }

      availabilityAPI
        .getUpcomingDays(doctor._id)
        .then((res) => {
          if (res.success && res.data.length > 0) {
            setUpcomingDays(res.data);
            setSelectedDate(res.data[0].date);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen, doctor]);

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    if (doctor && selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot('');
      setErrorMessage('');

      availabilityAPI
        .getDoctorAvailability(doctor._id, selectedDate)
        .then((res) => {
          if (res.success) {
            setAvailabilityData(res.data);
          }
        })
        .catch((err) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [doctor, selectedDate]);

  // Countdown timer for active QR code in Step 2
  useEffect(() => {
    if (bookingStep === 2 && !bookingSuccessData) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bookingStep, bookingSuccessData]);

  if (!isOpen || !doctor) return null;

  const doctorUser = doctor.userId || {};
  const hospital = doctor.hospitalId || {};
  const doctorDisplayName = doctorUser.name
    ? `Dr. ${doctorUser.name.replace(/^(dr\.?\s*)+/i, '')}`
    : 'this doctor';

  // Format MM:SS for countdown timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };



  // Validate Step 1 and proceed to Step 2 (UPI Payment)
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrorMessage('Please login as a patient to book an appointment.');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setErrorMessage('Please pick both an appointment date and an available time slot.');
      return;
    }

    // Strict Shift Validation before submit
    const isPM = selectedSlot.includes('PM');
    const isNoon = selectedSlot.startsWith('12:');
    const isEvening = isPM && !isNoon;

    if (doctor.shift === 'Morning' && isEvening) {
      setErrorMessage(
        `Strict Shift Restriction: ${doctorDisplayName} is only available for Morning shift consultations (09:00 AM - 01:00 PM). Please choose an available morning time slot.`
      );
      return;
    }

    if (doctor.shift === 'Evening' && !isEvening) {
      setErrorMessage(
        `Strict Shift Restriction: ${doctorDisplayName} is only available for Evening shift consultations (02:00 PM - 08:00 PM). Please choose an available evening time slot.`
      );
      return;
    }

    setErrorMessage('');
    setBookingStep(2);
  };

  // Final booking submission after UPI payment review
  const handleConfirmAndPay = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setErrorMessage('');

    try {
      const res = await appointmentAPI.bookAppointment({
        doctorId: doctor._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        symptoms,
        notes,
        transactionId: utrNumber.trim() || undefined,
        paymentMethod: 'UPI_QR',
      });

      if (res.success) {
        setBookingSuccessData(res.data);
        fetchNotifications();
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        if (onBookingSuccess) {
          onBookingSuccess(res.data);
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // Strict Shift Slot Filtering:
  const allSlots = availabilityData?.slots || [];
  const filteredSlots = allSlots.filter((slot) => {
    const isPM = slot.time.includes('PM');
    const isNoon = slot.time.startsWith('12:');
    const isEvening = isPM && !isNoon;

    // Strict shift restriction:
    if (doctor.shift === 'Morning') return !isEvening;
    if (doctor.shift === 'Evening') return isEvening;

    // Dual shift doctors obey user toggle:
    if (shiftFilter === 'Morning') return !isEvening;
    if (shiftFilter === 'Evening') return isEvening;
    return true;
  });

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '24px 16px',
        alignItems: 'flex-start',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: bookingStep === 2 ? '680px' : '640px',
          width: '100%',
          padding: '0',
          margin: 'auto',
          borderRadius: 'var(--radius-xl)',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid var(--slate-200)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'none',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease',
        }}
      >
        {/* Modal Header (Sticky) */}
        <div
          style={{
            padding: '18px 22px',
            background: 'linear-gradient(135deg, var(--slate-900) 0%, #0f172a 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--primary-300)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Care Connect Medical Booking</span>
              {bookingStep === 2 && !bookingSuccessData && (
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#4ade80',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    padding: '1px 7px',
                    borderRadius: '10px',
                    fontSize: '0.68rem',
                  }}
                >
                  Step 2 of 2: UPI Payment
                </span>
              )}
            </div>
            <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginTop: '3px' }}>
              {doctorDisplayName}
            </h3>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--slate-300)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
                flexWrap: 'wrap',
              }}
            >
              <span>{doctor.specialization}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} style={{ color: 'var(--primary-400)' }} />
                {hospital.name || 'Hospital'} (Pincode: {hospital.pincode || doctor.hospitalPincode})
              </span>
              <span>•</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background:
                    doctor.shift === 'Morning'
                      ? '#dbeafe'
                      : doctor.shift === 'Evening'
                      ? '#ffedd5'
                      : '#f3e8ff',
                  color:
                    doctor.shift === 'Morning'
                      ? '#1e40af'
                      : doctor.shift === 'Evening'
                      ? '#9a3412'
                      : '#6b21a8',
                  fontWeight: 700,
                }}
              >
                {doctor.shift === 'Morning'
                  ? '🌅 Morning Shift (Strict)'
                  : doctor.shift === 'Evening'
                  ? '🌆 Evening Shift (Strict)'
                  : '🔄 Dual Shift'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body with Full Scroll */}
        <div
          className="modal-body-scroll"
          style={{
            padding: '22px',
            overflowY: 'visible',
            flex: '1 1 auto',
          }}
        >
          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--danger-bg)',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW A: SUCCESS SCREEN (AFTER PAYMENT & BOOKING CONFIRMATION) */}
          {/* ============================================================== */}
          {bookingSuccessData ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 0 8px rgba(34, 197, 94, 0.15)',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h2 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
                Appointment & Payment Confirmed!
              </h2>

              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', marginTop: '6px' }}>
                Your consultation has been confirmed with {doctorDisplayName}. An instant receipt has been generated.
              </p>

              {/* Verified Digital Receipt Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--primary-200)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  margin: '20px 0',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed var(--slate-200)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Official Digital Booking Slip
                  </span>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={12} /> Paid via UPI QR
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Appointment ID:</span>
                  <strong style={{ color: 'var(--primary-700)', letterSpacing: '0.04em' }}>
                    {bookingSuccessData.appointmentNumber}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Doctor & Specialization:</span>
                  <strong style={{ color: 'var(--slate-800)' }}>
                    {doctorDisplayName} ({doctor.specialization})
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Scheduled Date & Slot:</span>
                  <strong>
                    {bookingSuccessData.date} at {bookingSuccessData.timeSlot}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Hospital / Pincode:</span>
                  <strong>
                    {hospital.name} (📍 {hospital.pincode})
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Verified Receiver:</span>
                  <strong style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Care Connect Healthcare Reception <BadgeCheck size={14} style={{ color: '#0284c7' }} />
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Payment Method:</span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-700)' }}>
                    UPI QR Code Payment
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-500)' }}>Transaction Reference:</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                    {bookingSuccessData.transactionId || 'UPI-VERIFIED-AUTH'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--slate-100)',
                  }}
                >
                  <span style={{ color: 'var(--slate-700)', fontWeight: 600 }}>Total Paid:</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--success)' }}>
                    ₹{bookingSuccessData.fee}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Printer size={16} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Done / View Dashboard
                </button>
              </div>
            </div>
          ) : bookingStep === 1 ? (
            /* ============================================================== */
            /* VIEW B: STEP 1 - DATE, TIME SLOT, AND SYMPTOMS SELECTION        */
            /* ============================================================== */
            <form onSubmit={handleProceedToPayment}>
              {!isAuthenticated && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #eff6ff 100%)',
                    border: '1.5px solid var(--primary-200)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '0.84rem', color: 'var(--slate-700)' }}>
                    <strong>Note:</strong> Browsing slots is open. Sign in or register to record your booking into MongoDB.
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Sign In
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* STEP 1: Select Date (Upcoming 7 Days Pills) */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} style={{ color: 'var(--primary-600)' }} />
                  <span>1. Select Appointment Date</span>
                </label>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '6px',
                  }}
                >
                  {upcomingDays.map((day) => {
                    const isSelected = selectedDate === day.date;
                    const dateObj = new Date(day.date);
                    const formattedDay = day.dayName.slice(0, 3);
                    const formattedNum = dateObj.getDate();
                    const monthName = dateObj.toLocaleString('en-US', { month: 'short' });

                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setSelectedDate(day.date)}
                        disabled={!day.isAvailable}
                        style={{
                          flex: '0 0 auto',
                          minWidth: '70px',
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--primary-600)' : '1.5px solid var(--slate-200)',
                          background: isSelected ? 'var(--primary-50)' : '#ffffff',
                          cursor: day.isAvailable ? 'pointer' : 'not-allowed',
                          opacity: day.isAvailable ? 1 : 0.45,
                          textAlign: 'center',
                          transition: 'var(--transition)',
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', color: isSelected ? 'var(--primary-700)' : 'var(--slate-500)', fontWeight: 600 }}>
                          {formattedDay}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isSelected ? 'var(--primary-700)' : 'var(--slate-900)' }}>
                          {formattedNum}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)' }}>
                          {monthName}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Shift Filter & Time Slots */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} style={{ color: 'var(--primary-600)' }} />
                    <span>2. Select Time Slot</span>
                  </label>

                  {/* Shift Filter Buttons or Locked Shift Badge */}
                  {doctor.shift === 'Morning' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        padding: '3px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1e40af' }}>
                        🌅 Strict Morning Shift (09:00 AM – 01:00 PM)
                      </span>
                    </div>
                  ) : doctor.shift === 'Evening' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fff7ed',
                        border: '1px solid #fed7aa',
                        padding: '3px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#c2410c' }}>
                        🌆 Strict Evening Shift (02:00 PM – 08:00 PM)
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '4px', background: 'var(--slate-100)', padding: '2px', borderRadius: '6px' }}>
                      {['All', 'Morning', 'Evening'].map((shift) => (
                        <button
                          key={shift}
                          type="button"
                          onClick={() => setShiftFilter(shift)}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: shiftFilter === shift ? '#ffffff' : 'transparent',
                            color: shiftFilter === shift ? 'var(--slate-900)' : 'var(--slate-500)',
                            cursor: 'pointer',
                            boxShadow: shiftFilter === shift ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          {shift}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {loadingSlots ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                    Loading available slots...
                  </div>
                ) : filteredSlots.length === 0 ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      background: 'var(--slate-50)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--slate-500)',
                      fontSize: '0.85rem',
                    }}
                  >
                    No available{' '}
                    {doctor.shift === 'Morning'
                      ? 'morning shift (09:00 AM – 01:00 PM)'
                      : doctor.shift === 'Evening'
                      ? 'evening shift (02:00 PM – 08:00 PM)'
                      : ''}{' '}
                    slots on this date. Doctor might be on break or fully booked.
                  </div>
                ) : (
                  <div
                    className="slot-grid-responsive"
                    style={{
                      maxHeight: '190px',
                      overflowY: 'auto',
                      padding: '4px',
                    }}
                  >
                    {filteredSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.isBooked}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`slot-pill ${slot.isBooked ? 'slot-booked' : ''} ${
                            isSelected ? 'slot-selected' : ''
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* STEP 3: Symptoms & Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={15} style={{ color: 'var(--primary-600)' }} />
                  <span>3. Symptoms & Health Concerns (Optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Describe symptoms, e.g. persistent cough, chest pain, fever..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* STEP 4: Fee & Proceed to Payment Button */}
              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--slate-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Consultation Fee
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    ₹{doctor.consultationFee}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlot}
                  className="btn btn-primary"
                  style={{
                    minWidth: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <QrCode size={16} />
                  <span>Proceed to Payment (₹{doctor.consultationFee})</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================== */
            /* VIEW C: STEP 2 - OFFICIAL UPI QR CODE PAYMENT SCREEN           */
            /* ============================================================== */
            <form onSubmit={handleConfirmAndPay}>
              {/* Back to Slot Selection & Timer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-700)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>Change Date / Slot</span>
                </button>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: '#92400e',
                    fontWeight: 700,
                  }}
                >
                  <Clock size={12} />
                  <span>QR Code active for: {formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Consultation Summary Strip */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
                  border: '1px solid #bbf7d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                    Scheduled Visit
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {selectedDate} at {selectedSlot}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                    Patient: <strong>{user?.name || 'Verified Patient'}</strong> • Phone: {user?.phone || 'On Record'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Total Payable
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                    ₹{doctor.consultationFee}
                  </div>
                </div>
              </div>

              {/* Real Paytm UPI QR Code Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                  marginBottom: '20px',
                }}
              >
                {/* Verified Header matching user's Paytm screen */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Building size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>Care Connect Hospital Reception</span>
                      <BadgeCheck size={16} style={{ color: '#0284c7' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                      Verified Hospital OPD Desk • Official UPI Payment
                    </div>
                  </div>
                </div>

                {/* QR Code Container */}
                <div
                  style={{
                    display: 'inline-block',
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '16px',
                    border: '1.5px solid #cbd5e1',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    maxWidth: '240px',
                    margin: '0 auto',
                  }}
                >
                  <img
                    src={qrCodeImg}
                    alt="Paytm UPI QR Code for Doctor Consultation Payment"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      display: 'block',
                    }}
                    onError={(e) => {
                      // Fallback to public folder path if asset resolution changes
                      e.target.src = '/payment-qr.jpg';
                    }}
                  />
                </div>

                {/* Instructions */}
                <div style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                  Scan with any UPI app: <strong>Paytm</strong>, <strong>PhonePe</strong>, <strong>Google Pay</strong>, or <strong>BHIM</strong>
                </div>
              </div>

              {/* Optional UTR / Reference ID Field */}
              <div style={{ marginBottom: '18px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={14} style={{ color: 'var(--primary-600)' }} />
                  <span>12-Digit UPI UTR / Transaction Reference (Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 430291029482 (From your payment receipt)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  style={{ fontSize: '0.86rem' }}
                />
                <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  For instant automated reconciliation, paste your 12-digit UPI reference number. If left blank, your payment is automatically verified via our reception gateway.
                </div>
              </div>

              {/* Security & Instant Confirmation Notice */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.76rem',
                  color: 'var(--slate-600)',
                }}
              >
                <ShieldCheck size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span>
                  <strong>100% Secure Transaction:</strong> Slots are instantly booked in real-time. Full refund guaranteed upon cancellation prior to OPD shift start.
                </span>
              </div>

              {/* Action Buttons - Sticky at bottom so always within reach */}
              <div
                style={{
                  position: 'sticky',
                  bottom: -22,
                  zIndex: 25,
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderTop: '1.5px solid #e2e8f0',
                  padding: '16px 22px',
                  margin: '20px -22px -22px -22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.06)',
                  borderBottomLeftRadius: 'var(--radius-xl)',
                  borderBottomRightRadius: 'var(--radius-xl)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setBookingStep(1)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.92rem',
                    padding: '12px 20px',
                  }}
                >
                  <Sparkles size={16} />
                  <span>
                    {bookingLoading ? 'Verifying & Securing Slot...' : `I Have Paid • Confirm Booking (₹${doctor.consultationFee})`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
