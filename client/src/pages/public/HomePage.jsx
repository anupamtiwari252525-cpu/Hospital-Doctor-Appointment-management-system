import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Stethoscope,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Activity,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  Building2,
  Users,
  Phone,
  Mail,
  HeartHandshake,
  FileText,
  Lock,
  ChevronRight,
  Hospital,
} from 'lucide-react';
import PincodeSearchBar from '../../components/search/PincodeSearchBar';
import DoctorCard from '../../components/doctor/DoctorCard';
import DoctorProfileModal from '../../components/doctor/DoctorProfileModal';
import HospitalCard from '../../components/hospital/HospitalCard';
import BookingModal from '../../components/appointment/BookingModal';
import { searchAPI, doctorAPI, hospitalAPI } from '../../services/api';

const POPULAR_PINCODES = [
  { pincode: '110001', area: 'Connaught Place, New Delhi' },
  { pincode: '110029', area: 'AIIMS / Safdarjung, New Delhi' },
  { pincode: '201301', area: 'Sector 62 / Atta, Noida' },
  { pincode: '122001', area: 'Cyber City / Sector 38, Gurugram' },
  { pincode: '201010', area: 'Indirapuram / Vaishali, Ghaziabad' },
  { pincode: '121002', area: 'Sector 16 / Mathura Rd, Faridabad' },
  { pincode: '250004', area: 'Garh Road, Meerut' },
  { pincode: '201204', area: 'Delhi-Meerut Road, Modinagar' },
];

export default function HomePage() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load top rated verified doctors
    doctorAPI
      .getAllDoctors({ isVerified: 'true' })
      .then((res) => {
        if (res.success && res.data) {
          setFeaturedDoctors(res.data);
        }
      })
      .catch((err) => console.error(err));

    // Load premier hospitals
    hospitalAPI
      .getAllHospitals()
      .then((res) => {
        if (res.success && res.data) {
          setHospitals(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleBookDoctor = (doc) => {
    setSelectedDoctorForBooking(doc);
    setIsBookingOpen(true);
  };

  const specializations = [
    { name: 'Cardiology', icon: HeartPulse, count: 'Heart & Vascular', color: '#ef4444', bg: '#fee2e2' },
    { name: 'Neurology', icon: Brain, count: 'Brain & Spine', color: '#8b5cf6', bg: '#f5f3ff' },
    { name: 'Orthopedics', icon: Bone, count: 'Joint & Bones', color: '#f59e0b', bg: '#fef3c7' },
    { name: 'Pediatrics', icon: Baby, count: 'Child Healthcare', color: '#0d9488', bg: '#ccfbf1' },
    { name: 'Dermatology', icon: Sparkles, count: 'Skin & Aesthetics', color: '#ec4899', bg: '#fce7f3' },
    { name: 'General Medicine', icon: Stethoscope, count: 'Family Physicians', color: '#2563eb', bg: '#dbeafe' },
  ];

  const displayedDoctors =
    selectedCity === 'All'
      ? featuredDoctors.slice(0, 6)
      : featuredDoctors
          .filter(
            (d) =>
              (d.userId?.city || '').toLowerCase().includes(selectedCity.toLowerCase()) ||
              (d.hospitalId?.city || '').toLowerCase().includes(selectedCity.toLowerCase())
          )
          .slice(0, 6);

  const displayedHospitals = hospitals.slice(0, 4);

  return (
    <div style={{ background: '#f8fafc' }}>
      
      {/* Hero Section */}
      <section
        className="hero-gradient"
        style={{
          padding: '70px 20px 85px',
          borderBottom: '1px solid var(--slate-200)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Trust Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '22px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ShieldCheck size={16} />
            <span>Verified Medical Specialists & 100% Digital Health Records</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              color: 'var(--slate-950)',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Find The Right Doctor Near You
            <br />
            <span style={{ color: 'var(--primary-600)' }}>Pincode-Based</span> Appointments in Minutes
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
              color: 'var(--slate-600)',
              maxWidth: '760px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Seamlessly discover accredited doctors and premier hospitals across your area. Inspect real-time OPD shifts, book instant consultation slots, and download official digital prescriptions.
          </p>

          {/* Primary Pincode Search Bar Widget */}
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <PincodeSearchBar />
          </div>

          {/* Popular Pincode Chips */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              Popular Pincodes:
            </span>
            {POPULAR_PINCODES.map((item) => (
              <button
                key={item.pincode}
                onClick={() => navigate(`/search?pincode=${item.pincode}`)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--slate-300)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-600)';
                  e.currentTarget.style.color = 'var(--primary-700)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--slate-300)';
                  e.currentTarget.style.color = 'var(--slate-700)';
                }}
              >
                <MapPin size={12} style={{ color: 'var(--primary-600)' }} />
                <span>{item.pincode}</span>
                <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>({item.area.split(',')[0]})</span>
              </button>
            ))}
          </div>

          {/* Key Metric Highlights */}
          <div
            style={{
              marginTop: '55px',
              paddingTop: '40px',
              borderTop: '1px solid var(--slate-200)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
            }}
          >
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--slate-900)' }}>1,000+</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '2px' }}>
                Verified Specialists
              </div>
            </div>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--primary-600)' }}>200+</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '2px' }}>
                Partner Hospitals
              </div>
            </div>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--sapphire-600)' }}>15,000+</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '2px' }}>
                Patient Consultations
              </div>
            </div>
            <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--success)' }}>99.2%</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)', fontWeight: 600, marginTop: '2px' }}>
                Patient Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight: About CARE CONNECT Section (2. About) */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0', padding: '0 20px' }}>
        <div
          className="glass-card"
          style={{
            padding: '44px 36px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            border: '1.5px solid var(--primary-200)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                <Activity size={14} />
                <span>About CARE CONNECT</span>
              </div>
              <h2 style={{ fontSize: '2.1rem', color: 'var(--slate-900)', fontWeight: 800, lineHeight: 1.25 }}>
                Modernizing Patient Care with Technology & Compassion
              </h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.96rem', lineHeight: 1.7, marginTop: '16px' }}>
                CARE CONNECT is engineered to streamline how patients find specialists and book confirmed hospital consultations. By eliminating manual paperwork and long clinic queues, we connect you directly to NMC/MCI-verified clinicians with instant digital health records.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--slate-800)', fontWeight: 600 }}>
                    Exact 6-Digit Pincode Proximity Engine (0–50 km radius)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--slate-800)', fontWeight: 600 }}>
                    Direct Doctor OPD Shift Management & 30-Minute Slots
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary-600)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--slate-800)', fontWeight: 600 }}>
                    Official Print-Ready Digital Prescriptions & Pharmacy Notes
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '28px' }}>
                <Link to="/about" className="btn btn-primary">
                  <span>Learn More About Our Mission</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#ffffff', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
                <Award size={28} style={{ color: 'var(--primary-600)', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>MCI Verified</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.5 }}>
                  Every doctor's license and clinical registration is verified before onboarding.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
                <Building2 size={28} style={{ color: 'var(--sapphire-600)', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>NABH Hospitals</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.5 }}>
                  Partnered with premier multi-speciality medical research institutes.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
                <FileText size={28} style={{ color: 'var(--success)', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>Digital Rx</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.5 }}>
                  Get complete diagnostic summaries and dosage schedules with instant digital access.
                </p>
              </div>

              <div style={{ background: '#ffffff', padding: '22px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', boxShadow: 'var(--shadow-sm)' }}>
                <Phone size={28} style={{ color: '#ef4444', marginBottom: '10px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>24/7 Helpline</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '4px', lineHeight: 1.5 }}>
                  Dedicated support desk for slot bookings and hospital emergency guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Grid & Doctors Section (3. Doctor) */}
      <section style={{ maxWidth: '1240px', margin: '75px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Specialized Care
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginTop: '4px', fontWeight: 800 }}>
              Consult Top Clinical Departments
            </h2>
          </div>
          <Link to="/search" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Explore All Specializations</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px' }}>
          {specializations.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(`/search?specialization=${spec.name}`)}
                className="glass-card-interactive"
                style={{
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: spec.bg,
                    color: spec.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={28} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', fontWeight: 700 }}>
                  {spec.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  {spec.count}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Section (3. Doctor Continued) */}
      <section style={{ maxWidth: '1240px', margin: '75px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified Medical Specialists
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginTop: '4px', fontWeight: 800 }}>
              Top Rated Doctors Ready For Consultation
            </h2>
          </div>
          <Link to="/search" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All Doctors ({featuredDoctors.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['All', 'New Delhi', 'Noida', 'Gurugram', 'Ghaziabad', 'Faridabad', 'Meerut', 'Modinagar'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1.5px solid',
                borderColor: selectedCity === city ? 'var(--primary-600)' : 'var(--slate-200)',
                background: selectedCity === city ? 'var(--primary-600)' : '#ffffff',
                color: selectedCity === city ? '#ffffff' : 'var(--slate-700)',
                boxShadow: selectedCity === city ? '0 4px 12px rgba(13, 148, 136, 0.25)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {city === 'All' ? 'All Locations' : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
          {displayedDoctors.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--slate-500)' }}>
              No doctors found matching this location filter right now.
            </div>
          ) : (
            displayedDoctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doctor={doc}
                onBookClick={() => handleBookDoctor(doc)}
                onViewProfileClick={(docToView) => {
                  setSelectedDoctorForProfile(docToView);
                  setIsProfileOpen(true);
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Partner Hospitals Section */}
      <section style={{ maxWidth: '1240px', margin: '75px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Healthcare Network
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginTop: '4px', fontWeight: 800 }}>
              Partner Hospitals & Medical Centres
            </h2>
          </div>
          <Link to="/hospitals" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>View All Partner Hospitals ({hospitals.length})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
          {displayedHospitals.map((hospital) => (
            <HospitalCard key={hospital._id} hospital={hospital} />
          ))}
        </div>
      </section>

      {/* 4-Step Consultation Process */}
      <section
        style={{
          maxWidth: '1240px',
          margin: '80px auto 0',
          padding: '50px 32px',
          background: 'linear-gradient(135deg, var(--slate-900) 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-xl)',
          color: '#ffffff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ color: 'var(--primary-400)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simple & Transparent
          </span>
          <h2 style={{ color: '#ffffff', fontSize: '2.1rem', marginTop: '6px', fontWeight: 800 }}>
            How Appointment Booking Works
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Search by Pincode',
              desc: 'Enter your 6-digit postal code to discover nearby verified specialists within your chosen distance radius.',
            },
            {
              step: '02',
              title: 'Select Available Slot',
              desc: 'Check live doctor shift timings and reserve an exact 30-minute consultation window for your schedule.',
            },
            {
              step: '03',
              title: 'Instant Confirmation',
              desc: 'Receive immediate booking confirmation and in-app alerts with zero clinic waiting times.',
            },
            {
              step: '04',
              title: 'Consult & Digital Rx',
              desc: 'Attend your consultation and receive a verified digital medical prescription ready to save or print.',
            },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '26px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-400)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {item.step}
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginTop: '14px', fontWeight: 700 }}>
                {item.title}
              </h4>
              <p style={{ color: 'var(--slate-300)', fontSize: '0.86rem', marginTop: '8px', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 24/7 Connect Helpline Bar */}
      <section style={{ maxWidth: '1240px', margin: '75px auto 0', padding: '0 20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #091e2b 0%, #0d9488 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '36px 32px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              <HeartHandshake size={14} />
              <span>CARE CONNECT Helpline</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 800, margin: 0 }}>
              Need Help Finding a Doctor or Hospital?
            </h3>
            <p style={{ color: '#e0f2fe', fontSize: '0.94rem', marginTop: '6px' }}>
              Our 24/7 coordination desk is ready to help with appointment schedules, directions, and emergency inquiries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="tel:+919876543210"
              className="btn btn-secondary"
              style={{ background: '#ffffff', color: 'var(--slate-900)', padding: '12px 22px', fontSize: '0.95rem' }}
            >
              <Phone size={17} style={{ color: '#ef4444' }} />
              <span>Call +91 98765 43210</span>
            </a>
            <a
              href="mailto:connect@careconnect.in"
              className="btn btn-outline"
              style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: '#ffffff', padding: '12px 22px', fontSize: '0.95rem' }}
            >
              <Mail size={17} />
              <span>connect@careconnect.in</span>
            </a>
          </div>
        </div>
      </section>

      {/* Doctor Detailed Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctorForProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onBookSlot={(doc) => {
          setIsProfileOpen(false);
          setSelectedDoctorForBooking(doc);
          setIsBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctorForBooking}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
