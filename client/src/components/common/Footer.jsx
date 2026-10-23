import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--slate-900)', color: 'var(--slate-300)', marginTop: '80px', borderTop: '1px solid var(--slate-800)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Activity size={22} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                CARE <span style={{ color: 'var(--primary-400)' }}>CONNECT</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
              Specialized Hospital & Doctor Appointment Management System with verified Indian medical specialists, pincode proximity matching, and instant digital prescriptions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'var(--primary-400)', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>NABH Accredited Hospitals & Verified Specialist Doctors</span>
            </div>
          </div>

          {/* Quick Pincode Searches */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>
              Regional Pincode Hubs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>
                <Link to="/search?pincode=110001" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 110001 - Connaught Place, New Delhi
                </Link>
              </li>
              <li>
                <Link to="/search?pincode=110029" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 110029 - AIIMS / Safdarjung, Delhi
                </Link>
              </li>
              <li>
                <Link to="/search?pincode=201204" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 201204 - Delhi-Meerut Rd, Modinagar
                </Link>
              </li>
              <li>
                <Link to="/search?pincode=201001" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 201001 - Navyug Market, Ghaziabad
                </Link>
              </li>
              <li>
                <Link to="/search?pincode=201010" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 201010 - Indirapuram / Vaishali, Ghaziabad
                </Link>
              </li>
              <li>
                <Link to="/search?pincode=250004" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  📍 250004 - Garh Road / Shastri Nagar, Meerut
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>
                <Link to="/about" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  About CARE CONNECT
                </Link>
              </li>
              <li>
                <Link to="/search" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  Find Doctors by Pincode
                </Link>
              </li>
              <li>
                <Link to="/hospitals" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  Partner Hospitals
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/register?role=doctor" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  Join as Medical Specialist
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--slate-400)', textDecoration: 'none' }}>
                  Sign In Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Connect & Helpline */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>
              Connect & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                <Phone size={16} />
                <span style={{ fontWeight: 700 }}>Connect: +91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
                <Phone size={16} />
                <span style={{ fontWeight: 600 }}>Emergency Toll-Free: 108 / 1800 200 2273</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-300)' }}>
                <Mail size={16} style={{ color: 'var(--primary-400)' }} />
                <a href="mailto:connect@careconnect.in" style={{ color: 'var(--primary-300)', textDecoration: 'none' }}>
                  connect@careconnect.in
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-400)' }}>
                <MapPin size={16} />
                <span>Premier Healthcare & Hospital Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--slate-800)',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: 'var(--slate-500)',
            gap: '12px',
          }}
        >
          <div>
            © 2026 CARE CONNECT. Hospital Doctor Appointment Management System.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Dedicated to excellence across Delhi, Modinagar, Ghaziabad & Meerut</span>
            <Heart size={14} style={{ color: '#ef4444' }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
