import React from 'react';
import { Star, MapPin, Building, Award, Calendar, CheckCircle, Navigation } from 'lucide-react';

export default function DoctorCard({ doctor, onBookClick, onViewProfileClick }) {
  const user = doctor.userId || {};
  const hospital = doctor.hospitalId || {};
  const distance = doctor.distanceKm;
  const isExact = doctor.isExactPincode;

  return (
    <div
      className="glass-card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner highlight if exact pincode match */}
      {isExact && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '4px 14px',
            borderBottomLeftRadius: '12px',
            textTransform: 'uppercase',
            boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)',
          }}
        >
          Direct Pincode Match
        </div>
      )}

      <div>
        {/* Doctor Header: Avatar, Name, Specialization, Verification */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div
            onClick={() => onViewProfileClick && onViewProfileClick(doctor)}
            style={{ position: 'relative', cursor: onViewProfileClick ? 'pointer' : 'default' }}
            title="Click to view doctor profile"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80';
              }}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '18px',
                objectFit: 'cover',
                border: '2px solid #ffffff',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {doctor.isVerified && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                }}
                title="Verified Medical Practitioner"
              >
                <CheckCircle size={18} fill="#2563eb" color="#ffffff" />
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-specialization">{doctor.specialization}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700, color: '#b45309' }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{doctor.rating}</span>
                <span style={{ color: 'var(--slate-400)', fontWeight: 500 }}>
                  ({doctor.totalReviews})
                </span>
              </div>
            </div>

            <h3
              onClick={() => onViewProfileClick && onViewProfileClick(doctor)}
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--slate-900)',
                marginTop: '4px',
                lineHeight: 1.2,
                cursor: onViewProfileClick ? 'pointer' : 'default',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (onViewProfileClick) e.currentTarget.style.color = 'var(--primary-600)';
              }}
              onMouseLeave={(e) => {
                if (onViewProfileClick) e.currentTarget.style.color = 'var(--slate-900)';
              }}
              title="Click to view doctor profile"
            >
              {user.name ? `Dr. ${user.name.replace(/^(dr\.?\s*)+/i, '')}` : 'Dr. Specialist'}
            </h3>

            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px', fontWeight: 500 }}>
              {doctor.qualification}
            </div>
          </div>
        </div>

        {/* Doctor Details: Hospital, Pincode Badge, Experience & Shift */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Hospital & Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.84rem', color: 'var(--slate-700)' }}>
            <Building size={16} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {hospital.name || 'Apollo Super Speciality Hospital'}
            </span>
          </div>

          {/* PINCODE & DISTANCE BADGE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="badge badge-pincode">
              <MapPin size={13} />
              <span>
                Pincode: <strong>{hospital.pincode || doctor.hospitalPincode || '110001'}</strong>
                {hospital.area ? ` • ${hospital.area.split('/')[0].trim()}` : ''}
              </span>
            </div>

            {distance !== null && distance !== undefined && (
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isExact ? 'var(--primary-700)' : 'var(--slate-600)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: isExact ? 'var(--primary-50)' : 'var(--slate-100)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Navigation size={11} />
                {isExact ? 'Same Pincode Area' : `${distance} km away`}
              </span>
            )}
          </div>

          {/* Experience & Shift Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Award size={15} style={{ color: 'var(--primary-600)' }} />
              <span>{doctor.experience}+ Years Exp</span>
            </div>
            
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                background: doctor.shift === 'Morning' ? '#eff6ff' : doctor.shift === 'Evening' ? '#fdf4ff' : '#f0fdfa',
                color: doctor.shift === 'Morning' ? '#1d4ed8' : doctor.shift === 'Evening' ? '#86198f' : '#0f766e',
                border: `1px solid ${doctor.shift === 'Morning' ? '#bfdbfe' : doctor.shift === 'Evening' ? '#f5d0fe' : '#99f6e4'}`,
              }}
            >
              {doctor.shift === 'Morning' ? '🌅 Morning Shift' : doctor.shift === 'Evening' ? '🌆 Evening Shift' : '🔄 Dual Shift'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Fee & Booking CTA */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onViewProfileClick && onViewProfileClick(doctor)}
            className="btn btn-secondary btn-sm"
            title="View Complete Doctor Profile"
            style={{ fontWeight: 600 }}
          >
            Profile
          </button>

          <button
            onClick={() => onBookClick(doctor)}
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 16px', fontWeight: 700 }}
          >
            <Calendar size={15} />
            <span>Book Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
