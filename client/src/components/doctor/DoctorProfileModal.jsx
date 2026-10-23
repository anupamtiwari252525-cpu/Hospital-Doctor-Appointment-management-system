import React from 'react';
import {
  X,
  Star,
  MapPin,
  Building,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  Stethoscope,
  IndianRupee,
  FileCheck,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export default function DoctorProfileModal({ doctor, isOpen, onClose, onBookSlot }) {
  if (!isOpen || !doctor) return null;

  const user = doctor.userId || {};
  const hospital = doctor.hospitalId || {};

  const getShiftBadge = (shift) => {
    if (shift === 'Morning') {
      return {
        label: 'Morning Shift Only (09:00 AM - 01:00 PM)',
        bg: '#eff6ff',
        color: '#1d4ed8',
        border: '#bfdbfe',
        icon: '🌅',
      };
    }
    if (shift === 'Evening') {
      return {
        label: 'Evening Shift Only (02:00 PM - 08:00 PM)',
        bg: '#fdf4ff',
        color: '#86198f',
        border: '#f5d0fe',
        icon: '🌆',
      };
    }
    return {
      label: 'Dual / Full-Day OPD (Morning & Evening)',
      bg: '#f0fdfa',
      color: '#0f766e',
      border: '#99f6e4',
      icon: '🔄',
    };
  };

  const shiftInfo = getShiftBadge(doctor.shift);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '22px 28px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '4px',
              }}
            >
              <Stethoscope size={14} />
              <span>Verified Medical Specialist Profile</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {user.name ? `Dr. ${user.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Dr. Specialist'}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1 }}>
          
          {/* Top Section: Photo + Core Details */}
          <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'}
                alt={user.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80';
                }}
                style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '22px',
                  objectFit: 'cover',
                  border: '3px solid #f1f5f9',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}
              />
              {doctor.isVerified && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                  title="MCI / State Medical Council Verified"
                >
                  <CheckCircle size={22} fill="#2563eb" color="#ffffff" />
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span
                  style={{
                    background: '#f0fdfa',
                    color: '#0f766e',
                    border: '1px solid #99f6e4',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {doctor.specialization}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#b45309',
                  }}
                >
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span>{doctor.rating}</span>
                  <span style={{ color: '#92400e', fontWeight: 500 }}>
                    ({doctor.totalReviews} verified patient ratings)
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                {doctor.qualification}
              </div>

              <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={14} style={{ color: '#0d9488' }} />
                <span>Medical License: <strong>{doctor.medicalLicenseNumber || 'MCI-IND-84920'}</strong></span>
              </div>

              {/* Consultation Fee Callout */}
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  OPD Consultation Fee:
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{doctor.consultationFee}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>per 30-min session</span>
              </div>
            </div>
          </div>

          {/* Shift Schedule Alert Banner */}
          <div
            style={{
              marginTop: '22px',
              padding: '14px 18px',
              background: shiftInfo.bg,
              border: `1.5px solid ${shiftInfo.border}`,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{shiftInfo.icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Availability Schedule
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: shiftInfo.color }}>
                  {shiftInfo.label}
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 600,
                color: shiftInfo.color,
                background: 'rgba(255,255,255,0.7)',
                padding: '4px 10px',
                borderRadius: '8px',
              }}
            >
              Strict Shift Enforcement Active
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginTop: '18px',
            }}
          >
            <div
              style={{
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0d9488', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Award size={15} />
                <span>Experience</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {doctor.experience}+ Years
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Active Clinical Practice</div>
            </div>

            <div
              style={{
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={15} />
                <span>Slot Duration</span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {doctor.slotDuration || 30} Minutes
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Per Individual Consultation</div>
            </div>

            <div
              style={{
                padding: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Calendar size={15} />
                <span>Working Days</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                Mon – Sat
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Advance 7-Day Slot Booking</div>
            </div>
          </div>

          {/* Hospital Affiliation & Location */}
          <div
            style={{
              marginTop: '18px',
              padding: '16px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Affiliated Medical Center
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Building size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {hospital.name || 'Apollo Super Speciality Hospital'}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <MapPin size={14} style={{ color: '#0d9488' }} />
                  <span>
                    {hospital.address ? `${hospital.address}, ` : ''}
                    {hospital.city || doctor.city || 'Delhi NCR'}
                  </span>
                  <span
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                    }}
                  >
                    📍 Pincode: {hospital.pincode || doctor.hospitalPincode || '110001'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About & Clinical Expertise */}
          <div style={{ marginTop: '18px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              About Doctor & Clinical Experience
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {doctor.about ||
                `Senior Consultant ${doctor.specialization} with over ${doctor.experience} years of clinical expertise. ${user.name ? `Dr. ${user.name.replace(/^(dr\.?\s*)+/i, '')}` : 'The doctor'} provides comprehensive diagnostic assessments, preventive care, and specialized patient management across Delhi NCR.`}
            </p>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div
          style={{
            padding: '16px 28px',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              if (onBookSlot) onBookSlot(doctor);
            }}
            className="btn btn-primary"
            style={{
              padding: '11px 24px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
            }}
          >
            <Calendar size={16} />
            <span>Book Consultation Slot ({shiftInfo.icon} {doctor.shift})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
