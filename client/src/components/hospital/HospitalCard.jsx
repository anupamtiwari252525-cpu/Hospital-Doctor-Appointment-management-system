import React from 'react';
import { Building2, MapPin, Star, Clock, Stethoscope, ChevronRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HospitalCard({ hospital, onSelect }) {
  const departments = hospital.departments || [];

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Hospital Photo & Rating Badge */}
        <div style={{ position: 'relative', height: '180px', width: '100%', background: 'var(--slate-200)' }}>
          <img
            src={hospital.image || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'}
            alt={hospital.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(6px)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#b45309',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{hospital.rating || 4.8}</span>
          </div>

          {/* Pincode Tag on Image */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <MapPin size={12} style={{ color: 'var(--primary-400)' }} />
            <span>Pincode: {hospital.pincode}</span>
          </div>
        </div>

        {/* Content Details */}
        <div style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', fontWeight: 700, lineHeight: 1.3 }}>
            {hospital.name}
          </h3>

          <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} style={{ color: 'var(--slate-400)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {hospital.area ? `${hospital.area.split('/')[0].trim()}, ` : ''}{hospital.city}, {hospital.state}
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} style={{ color: 'var(--primary-600)' }} />
            <span>{hospital.openingHours}</span>
          </div>

          {hospital.contactNumber && (
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} style={{ color: 'var(--sapphire-600)' }} />
              <span>{hospital.contactNumber}</span>
            </div>
          )}

          {/* Department Tags */}
          <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {departments.slice(0, 3).map((dept, i) => (
              <span key={i} className="badge badge-specialization" style={{ fontSize: '0.72rem' }}>
                {dept}
              </span>
            ))}
            {departments.length > 3 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', alignSelf: 'center', fontWeight: 600 }}>
                +{departments.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          padding: '12px 18px',
          borderTop: '1px solid var(--slate-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to={`/search?pincode=${hospital.pincode}`}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Stethoscope size={15} />
          <span>Find Doctors in this Pincode</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
