import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { availabilityAPI, appointmentAPI } from '../../services/api';

export default function RescheduleModal({ appointment, isOpen, onClose, onRescheduled }) {
  if (!isOpen || !appointment) return null;

  const doctor = appointment.doctorId || {};
  const [upcomingDays, setUpcomingDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(appointment.date);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor._id) {
      availabilityAPI
        .getUpcomingDays(doctor._id)
        .then((res) => {
          if (res.success) {
            setUpcomingDays(res.data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [doctor._id]);

  useEffect(() => {
    if (doctor._id && selectedDate) {
      availabilityAPI
        .getDoctorAvailability(doctor._id, selectedDate)
        .then((res) => {
          if (res.success) {
            setSlots(res.data.slots || []);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [doctor._id, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setError('Please choose a new date and available time slot.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await appointmentAPI.rescheduleAppointment(appointment._id, {
        newDate: selectedDate,
        newTimeSlot: selectedSlot,
      });

      if (res.success) {
        if (onRescheduled) onRescheduled(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Reschedule Appointment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--danger-bg)',
                color: '#b91c1c',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '14px',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ background: 'var(--slate-50)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.84rem' }}>
            <div style={{ color: 'var(--slate-500)' }}>Current Scheduled Slot:</div>
            <strong style={{ color: 'var(--slate-900)' }}>
              {appointment.date} at {appointment.timeSlot}
            </strong>
          </div>

          <div className="form-group">
            <label className="form-label">Pick New Date</label>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {upcomingDays.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: selectedDate === d.date ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                    background: selectedDate === d.date ? 'var(--primary-50)' : '#fff',
                    color: selectedDate === d.date ? 'var(--primary-700)' : 'var(--slate-700)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {d.date.slice(5)} ({d.dayName.slice(0, 3)})
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pick New Available Slot</label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))',
                gap: '6px',
                maxHeight: '160px',
                overflowY: 'auto',
              }}
            >
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.isBooked}
                  onClick={() => setSelectedSlot(s.time)}
                  className={`slot-pill ${s.isBooked ? 'slot-booked' : ''} ${selectedSlot === s.time ? 'slot-selected' : ''}`}
                  style={{ padding: '8px 6px', fontSize: '0.8rem' }}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading || !selectedSlot} className="btn btn-primary btn-sm">
              {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
