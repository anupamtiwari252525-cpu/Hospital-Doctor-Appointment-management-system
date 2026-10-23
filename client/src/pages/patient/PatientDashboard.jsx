import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Star,
  XCircle,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Building,
  User,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, prescriptionAPI } from '../../services/api';
import PrescriptionModal from '../../components/prescription/PrescriptionModal';
import ReviewModal from '../../components/review/ReviewModal';
import RescheduleModal from '../../components/appointment/RescheduleModal';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'cancelled', 'prescriptions'
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [aptRes, rxRes] = await Promise.all([
        appointmentAPI.getAppointments(),
        prescriptionAPI.getPatientPrescriptions(),
      ]);

      if (aptRes.success) setAppointments(aptRes.data);
      if (rxRes.success) setPrescriptions(rxRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleCancelAppointment = async (id) => {
    const reason = window.prompt('Please enter cancellation reason:', 'Schedule conflict');
    if (reason) {
      try {
        await appointmentAPI.cancelAppointment(id, reason);
        fetchPatientData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleOpenPrescription = async (aptId) => {
    try {
      const res = await prescriptionAPI.getPrescriptionByAppointment(aptId);
      if (res.success) {
        setSelectedPrescription(res.data);
        setIsPrescriptionModalOpen(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Appointments
  const upcomingAppointments = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed' || a.status === 'rescheduled');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Welcome & Patient Profile Card */}
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
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
                Hello, {user?.name}
              </h1>
              <span className="badge badge-completed">Verified Patient</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              {user?.email} • {user?.phone || 'No phone'} • 📍 Pincode: <strong>{user?.pincode || '110001'}</strong>
            </div>
          </div>
        </div>

        <Link to="/search" className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Book New Doctor Slot</span>
        </Link>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--slate-200)',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'upcoming', label: `Upcoming Appointments (${upcomingAppointments.length})`, icon: Calendar },
          { key: 'completed', label: `Consultation History (${completedAppointments.length})`, icon: CheckCircle2 },
          { key: 'prescriptions', label: `Digital Prescriptions (${prescriptions.length})`, icon: FileText },
          { key: 'cancelled', label: `Cancelled (${cancelledAppointments.length})`, icon: XCircle },
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
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate-500)' }}>
          <RefreshCw size={28} className="spin" style={{ margin: '0 auto 10px', color: 'var(--primary-600)' }} />
          <div>Loading your appointment records...</div>
        </div>
      ) : activeTab === 'prescriptions' ? (
        /* Prescriptions Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {prescriptions.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '50px', textAlign: 'center', color: 'var(--slate-500)' }}>
              <FileText size={36} style={{ color: 'var(--slate-300)', margin: '0 auto 10px' }} />
              <h3>No digital prescriptions issued yet</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Prescriptions issued by your doctor after a completed consultation will appear here.</p>
            </div>
          ) : (
            prescriptions.map((rx) => {
              const doc = rx.doctorId || {};
              const docUser = doc.userId || {};
              const hosp = rx.hospitalId || {};
              return (
                <div key={rx._id} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-specialization">{doc.specialization || 'Clinical Rx'}</span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '6px', color: 'var(--slate-900)' }}>
                        {docUser.name ? `Dr. ${docUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Dr. Physician'}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                        {hosp.name || 'Hospital'} • Pincode: <strong>{hosp.pincode}</strong>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ margin: '14px 0', background: 'var(--slate-50)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--slate-500)', fontSize: '0.74rem' }}>Diagnosis:</div>
                    <strong style={{ color: 'var(--primary-800)' }}>{rx.diagnosis}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                      {rx.medicines?.length || 0} Medicines Prescribed
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPrescription(rx);
                      setIsPrescriptionModalOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <FileText size={15} />
                    <span>View & Print Prescription</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Appointments List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(() => {
            const list =
              activeTab === 'upcoming'
                ? upcomingAppointments
                : activeTab === 'completed'
                ? completedAppointments
                : cancelledAppointments;

            if (list.length === 0) {
              return (
                <div className="glass-card" style={{ padding: '50px', textAlign: 'center', color: 'var(--slate-500)' }}>
                  <Calendar size={36} style={{ color: 'var(--slate-300)', margin: '0 auto 10px' }} />
                  <h3>No {activeTab} appointments found</h3>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    {activeTab === 'upcoming' ? 'You have no scheduled visits. Search doctors to book a slot.' : ''}
                  </p>
                </div>
              );
            }

            return list.map((apt) => {
              const doc = apt.doctorId || {};
              const docUser = doc.userId || {};
              const hosp = apt.hospitalId || {};

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
                  {/* Left: Doctor & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        padding: '12px 14px',
                        background: 'var(--primary-50)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        minWidth: '70px',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                        {new Date(apt.date).getDate()}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--slate-500)' }}>
                        {new Date(apt.date).toLocaleString('en-US', { month: 'short' })}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${apt.status}`}>
                          {apt.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                          #{apt.appointmentNumber}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginTop: '4px' }}>
                        {docUser.name ? `Dr. ${docUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Dr. Physician'}
                      </h4>

                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <span>{doc.specialization}</span>
                        <span>•</span>
                        <span>{hosp.name}</span>
                        <span>•</span>
                        <span className="badge badge-pincode" style={{ fontSize: '0.7rem' }}>
                          📍 {hosp.pincode}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--primary-700)', fontWeight: 600, marginTop: '4px' }}>
                        Slot: {apt.timeSlot}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {apt.status === 'completed' && (
                      <>
                        {apt.hasPrescription && (
                          <button
                            onClick={() => handleOpenPrescription(apt._id)}
                            className="btn btn-outline btn-sm"
                          >
                            <FileText size={15} />
                            <span>Prescription</span>
                          </button>
                        )}

                        {!apt.isReviewed && (
                          <button
                            onClick={() => {
                              setSelectedAppointmentForReview(apt);
                              setIsReviewModalOpen(true);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            <Star size={15} />
                            <span>Write Review</span>
                          </button>
                        )}
                      </>
                    )}

                    {(apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'rescheduled') && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAppointmentForReschedule(apt);
                            setIsRescheduleModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          <RotateCcw size={14} />
                          <span>Reschedule</span>
                        </button>

                        <button
                          onClick={() => handleCancelAppointment(apt._id)}
                          className="btn btn-sm"
                          style={{ color: '#ef4444', background: '#fee2e2', border: '1px solid #fecaca' }}
                        >
                          <XCircle size={14} />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Prescription View Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        appointment={selectedAppointmentForReview}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => fetchPatientData()}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        appointment={selectedAppointmentForReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onRescheduled={() => fetchPatientData()}
      />
    </div>
  );
}
