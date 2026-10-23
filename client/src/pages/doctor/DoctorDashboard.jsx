import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  Settings,
  AlertCircle,
  RefreshCw,
  Building,
  MapPin,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, appointmentAPI, availabilityAPI, reviewAPI } from '../../services/api';
import AddPrescriptionModal from '../../components/prescription/AddPrescriptionModal';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'schedule', 'reviews'
  const [loading, setLoading] = useState(true);

  // Modals & Action States
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  // Schedule settings form state
  const [scheduleData, setScheduleData] = useState({
    shift: 'Both',
    startHour: '09:00 AM',
    endHour: '05:00 PM',
    breakStart: '01:00 PM',
    breakEnd: '02:00 PM',
    slotDuration: 30,
    consultationFee: 1200,
  });
  const [scheduleSuccess, setScheduleSuccess] = useState('');

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [profRes, aptRes] = await Promise.all([
        doctorAPI.getMyProfile(),
        appointmentAPI.getAppointments(),
      ]);

      if (profRes.success) {
        setProfile(profRes.data);
        setScheduleData({
          shift: profRes.data.shift || 'Both',
          startHour: profRes.data.startHour || '09:00 AM',
          endHour: profRes.data.endHour || '05:00 PM',
          breakStart: profRes.data.breakStart || '01:00 PM',
          breakEnd: profRes.data.breakEnd || '02:00 PM',
          slotDuration: profRes.data.slotDuration || 30,
          consultationFee: profRes.data.consultationFee || 1200,
        });

        // Fetch doctor reviews
        const revRes = await reviewAPI.getDoctorReviews(profRes.data._id);
        if (revRes.success) setReviews(revRes.data);
      }

      if (aptRes.success) {
        setAppointments(aptRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleConfirmAppointment = async (id) => {
    try {
      await appointmentAPI.confirmAppointment(id);
      fetchDoctorData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelAppointment = async (id) => {
    const reason = window.prompt('Enter reason for cancellation:', 'Doctor emergency surgery');
    if (reason) {
      try {
        await appointmentAPI.cancelAppointment(id, reason);
        fetchDoctorData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setScheduleSuccess('');
    try {
      await doctorAPI.updateDoctor(profile._id, scheduleData);
      setScheduleSuccess('Availability schedule and consultation fees saved successfully!');
      fetchDoctorData();
    } catch (err) {
      alert(err.message);
    }
  };

  const hospital = profile?.hospitalId || {};

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Top Clinical Header */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            style={{ width: '68px', height: '68px', borderRadius: '18px', objectFit: 'cover', border: '2px solid var(--primary-600)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
                {user?.name}
              </h1>
              {profile?.isVerified && (
                <span className="badge badge-confirmed">Verified Clinician</span>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              {profile?.qualification} • <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{profile?.specialization}</span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={14} style={{ color: 'var(--slate-400)' }} />
              <span>{hospital.name || 'Apollo Hospital'}</span>
              <span>•</span>
              <span className="badge badge-pincode" style={{ fontSize: '0.7rem' }}>
                📍 Pincode: {hospital.pincode || profile?.hospitalPincode}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div style={{ display: 'flex', gap: '16px', textAlign: 'center' }}>
          <div style={{ background: 'var(--slate-50)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              {appointments.filter((a) => a.status === 'pending').length}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600 }}>Pending</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
              {appointments.filter((a) => a.status === 'completed').length}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600 }}>Completed</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <Star size={16} fill="#f59e0b" />
              <span>{profile?.rating || '4.9'}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              {reviews.length} Reviews
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--slate-200)',
          marginBottom: '24px',
        }}
      >
        {[
          { key: 'appointments', label: `Consultations Queue (${appointments.length})`, icon: Calendar },
          { key: 'schedule', label: 'Availability & Shift Settings', icon: Settings },
          { key: 'reviews', label: `Patient Reviews (${reviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--slate-500)',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'var(--transition)',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Consultations Queue */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {appointments.length === 0 ? (
            <div className="glass-card" style={{ padding: '50px', textAlign: 'center', color: 'var(--slate-500)' }}>
              <Calendar size={36} style={{ color: 'var(--slate-300)', margin: '0 auto 10px' }} />
              <h3>No appointment requests</h3>
              <p style={{ fontSize: '0.85rem' }}>Upcoming patient bookings will appear here in real-time.</p>
            </div>
          ) : (
            appointments.map((apt) => {
              const patient = apt.patientId || {};
              return (
                <div
                  key={apt._id}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={patient.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={patient.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge badge-${apt.status}`}>{apt.status}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                          #{apt.appointmentNumber}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginTop: '4px' }}>
                        {patient.name}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        Slot: <strong>{apt.date} at {apt.timeSlot}</strong> • Patient Pincode: 📍 {patient.pincode || 'N/A'}
                      </div>
                      {apt.symptoms && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)', marginTop: '4px', background: 'var(--slate-50)', padding: '4px 8px', borderRadius: '6px' }}>
                          Symptoms: <em>"{apt.symptoms}"</em>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmAppointment(apt._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle size={15} />
                        <span>Confirm Visit</span>
                      </button>
                    )}

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          setSelectedAppointmentForRx(apt);
                          setIsRxModalOpen(true);
                        }}
                        className="btn btn-sm"
                        style={{ background: 'var(--success)', color: '#ffffff' }}
                      >
                        <FileText size={15} />
                        <span>Consult & Prescribe</span>
                      </button>
                    )}

                    {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(apt._id)}
                        className="btn btn-sm"
                        style={{ color: '#ef4444', background: '#fee2e2' }}
                      >
                        <XCircle size={15} />
                        <span>Cancel</span>
                      </button>
                    )}

                    {apt.status === 'completed' && (
                      <span className="badge badge-completed">
                        Prescription Issued • Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Availability Schedule & Shift Configuration */}
      {activeTab === 'schedule' && (
        <div className="glass-card" style={{ maxWidth: '640px', padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
            Doctor Shift & Slot Generation Settings
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '20px' }}>
            Slots are automatically partitioned based on start time, end time, and break periods.
          </p>

          {scheduleSuccess && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--success-bg)',
                color: '#047857',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              {scheduleSuccess}
            </div>
          )}

          <form onSubmit={handleSaveSchedule}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Shift Coverage</label>
                <select
                  className="form-control"
                  value={scheduleData.shift}
                  onChange={(e) => setScheduleData({ ...scheduleData, shift: e.target.value })}
                >
                  <option value="Both">Both (Morning & Evening)</option>
                  <option value="Morning">Morning Shift Only</option>
                  <option value="Evening">Evening Shift Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={scheduleData.consultationFee}
                  onChange={(e) => setScheduleData({ ...scheduleData, consultationFee: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">OPD Start Hour</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="09:00 AM"
                  value={scheduleData.startHour}
                  onChange={(e) => setScheduleData({ ...scheduleData, startHour: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD End Hour</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="05:00 PM"
                  value={scheduleData.endHour}
                  onChange={(e) => setScheduleData({ ...scheduleData, endHour: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Break Start</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="01:00 PM"
                  value={scheduleData.breakStart}
                  onChange={(e) => setScheduleData({ ...scheduleData, breakStart: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Break End</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="02:00 PM"
                  value={scheduleData.breakEnd}
                  onChange={(e) => setScheduleData({ ...scheduleData, breakEnd: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slot Duration (Min)</label>
                <select
                  className="form-control"
                  value={scheduleData.slotDuration}
                  onChange={(e) => setScheduleData({ ...scheduleData, slotDuration: Number(e.target.value) })}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              <Save size={16} />
              <span>Update Availability Schedule</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Patient Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {reviews.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', color: 'var(--slate-500)' }}>
              <Star size={36} style={{ color: 'var(--slate-300)', margin: '0 auto 10px' }} />
              <h3>No patient reviews yet</h3>
              <p style={{ fontSize: '0.85rem' }}>Reviews will appear here once patients complete consultation visits.</p>
            </div>
          ) : (
            reviews.map((rev) => {
              const patient = rev.patientId || {};
              return (
                <div key={rev._id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={patient.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={patient.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-900)' }}>
                          {patient.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Consultation & Digital Prescription Modal */}
      <AddPrescriptionModal
        appointment={selectedAppointmentForRx}
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onPrescriptionAdded={() => fetchDoctorData()}
      />
    </div>
  );
}
