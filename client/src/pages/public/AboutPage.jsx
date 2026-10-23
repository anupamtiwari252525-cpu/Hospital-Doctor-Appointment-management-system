import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Heart,
  Award,
  Users,
  Building2,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  FileText,
  Lock,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 15% 25%, rgba(13, 148, 136, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(37, 99, 235, 0.1) 0%, transparent 45%), linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)',
          padding: '70px 20px 80px',
          borderBottom: '1px solid var(--slate-200)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Official Healthcare Network</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: 'var(--slate-950)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            Transforming Healthcare Access
            <br />
            <span style={{ color: 'var(--primary-600)' }}>One Click at a Time</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--slate-600)',
              lineHeight: 1.6,
              maxWidth: '780px',
              margin: '0 auto 36px',
            }}
          >
            CARE CONNECT is a digital medical management platform designed to connect patients with 1,000+ top verified doctors, 200 super-speciality hospitals across 8 Delhi NCR regional hubs, offering instant OPD appointments with real-time slot tracking and paperless digital prescriptions.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn btn-primary btn-lg">
              <Stethoscope size={18} />
              <span>Find Verified Doctors</span>
            </Link>
            <Link to="/hospitals" className="btn btn-secondary btn-lg">
              <Building2 size={18} />
              <span>Explore Hospitals</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Core Mission & Values */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Our Founding Mission
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--slate-900)', marginTop: '6px', lineHeight: 1.25 }}>
              Eliminating Healthcare Delays & Fragmented Medical Records
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', lineHeight: 1.7, marginTop: '16px' }}>
              In traditional healthcare systems, patients face agonizing waiting times, unorganized paper prescriptions, and uncertainty about doctor availability. CARE CONNECT was established to replace this friction with transparent, real-time medical scheduling.
            </p>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem', lineHeight: 1.7, marginTop: '12px' }}>
              Serving the entire Delhi NCR healthcare network across 8 key regional hubs (New Delhi, Noida, Greater Noida, Gurugram, Ghaziabad, Faridabad, Meerut, and Modinagar), our platform empowers patients to discover doctors within their exact postal pincode, view verified NMC/MCI credentials, book confirmed 30-minute consultation slots, and securely receive print-ready prescriptions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>NMC/MCI Verified Doctors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>NABH Hospital Partners</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>100% Digital Prescriptions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>24/7 Patient Coordination</span>
              </div>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: '36px',
              background: 'linear-gradient(135deg, #091e2b 0%, #0f2d3d 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 800, marginBottom: '14px' }}>
              Why Choose CARE CONNECT?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Built strictly on the MERN stack with MongoDB data persistence, our architecture offers enterprise reliability for patients, doctors, and hospital administrators.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(13, 148, 136, 0.3)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>Pincode Proximity Engine</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0' }}>Search healthcare facilities by your exact 6-digit postal code with flexible radius calculations.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.3)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>Real-Time Slot Engine</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0' }}>Doctor shifts (Morning/Evening) are dynamically mapped into available 30-minute booking intervals.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.3)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>Confidential & Encrypted</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '3px 0 0' }}>Bcrypt password hashing and JWT authorization protect all medical and patient consultation records.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Stats Section */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0', padding: '0 20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 32px',
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '28px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>1,000+</div>
              <div style={{ fontSize: '0.92rem', color: '#ccfbf1', fontWeight: 600, marginTop: '4px' }}>Specialist Doctors</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>200</div>
              <div style={{ fontSize: '0.92rem', color: '#ccfbf1', fontWeight: 600, marginTop: '4px' }}>Network Hospitals</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>8</div>
              <div style={{ fontSize: '0.92rem', color: '#ccfbf1', fontWeight: 600, marginTop: '4px' }}>Regional Medical Hubs</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>100%</div>
              <div style={{ fontSize: '0.92rem', color: '#ccfbf1', fontWeight: 600, marginTop: '4px' }}>Digital Record Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Connect Desk Banner */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0', padding: '0 20px' }}>
        <div
          className="glass-card"
          style={{
            padding: '36px',
            border: '1.5px solid var(--primary-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            background: '#ffffff',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Phone size={16} />
              <span>24/7 Medical Assistance</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--slate-900)', fontWeight: 800, marginTop: '4px' }}>
              Have Questions or Need an Emergency Appointment?
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', marginTop: '6px' }}>
              Our patient care specialists are available 24/7 to assist with consultations, directions, and emergency hospital transfers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="tel:+919876543210"
              className="btn btn-primary"
              style={{ padding: '12px 22px', fontSize: '0.95rem' }}
            >
              <Phone size={17} />
              <span>Call +91 98765 43210</span>
            </a>
            <a
              href="mailto:connect@careconnect.in"
              className="btn btn-secondary"
              style={{ padding: '12px 22px', fontSize: '0.95rem' }}
            >
              <Mail size={17} />
              <span>Email Coordination Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
