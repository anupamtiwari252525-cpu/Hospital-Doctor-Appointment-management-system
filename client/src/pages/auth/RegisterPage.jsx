import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserPlus,
  User,
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Building2,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Heart,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Activity,
  Check,
  Search,
  Star,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hospitalAPI } from '../../services/api';

const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology & Obstetrics',
  'Dermatology',
  'Ophthalmology',
  'ENT (Otolaryngology)',
  'Pulmonology',
  'Psychiatry',
];

const CITIES = [
  { name: 'New Delhi', state: 'Delhi', defaultPin: '110001' },
  { name: 'Gurugram', state: 'Haryana', defaultPin: '122001' },
  { name: 'Noida', state: 'Uttar Pradesh', defaultPin: '201301' },
  { name: 'Greater Noida', state: 'Uttar Pradesh', defaultPin: '201310' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', defaultPin: '201001' },
  { name: 'Faridabad', state: 'Haryana', defaultPin: '121001' },
  { name: 'Meerut', state: 'Uttar Pradesh', defaultPin: '250004' },
  { name: 'Modinagar', state: 'Uttar Pradesh', defaultPin: '201204' },
];

const QUICK_PINCODES = [
  { pin: '110001', label: 'Connaught Place, Delhi' },
  { pin: '110029', label: 'AIIMS / Safdarjung, Delhi' },
  { pin: '122001', label: 'Gurugram Central' },
  { pin: '201301', label: 'Sector 18, Noida' },
  { pin: '201310', label: 'Alpha 1, Greater Noida' },
  { pin: '201001', label: 'Navyug Market, Ghaziabad' },
  { pin: '121001', label: 'Old Faridabad' },
  { pin: '250004', label: 'Shastri Nagar, Meerut' },
  { pin: '201204', label: 'Modinagar Central, UP' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    bloodGroup: 'B+',
    emergencyContact: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    address: '',
    // Doctor Specific
    qualification: 'MBBS, MD',
    specialization: 'General Medicine',
    experience: '6',
    consultationFee: '600',
    hospitalId: '',
    medicalLicenseNumber: '',
    shift: 'Both',
    slotDuration: '30',
    about: '',
  });

  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [hospitalCityFilter, setHospitalCityFilter] = useState('All');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Load all 200 active hospitals for doctor affiliation
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const res = await hospitalAPI.getAllHospitals();
        if (res.success && res.data) {
          setHospitals(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              hospitalId: prev.hospitalId || res.data[0]._id,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not load hospitals list:', err.message);
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  // Filter hospitals among all 200 network hospitals in Delhi NCR
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesCity =
        hospitalCityFilter === 'All' ||
        (h.city || '').toLowerCase() === hospitalCityFilter.toLowerCase();
      if (!matchesCity) return false;
      if (!hospitalSearch.trim()) return true;
      const q = hospitalSearch.trim().toLowerCase();
      return (
        (h.name || '').toLowerCase().includes(q) ||
        (h.city || '').toLowerCase().includes(q) ||
        (h.area || '').toLowerCase().includes(q) ||
        (h.pincode || '').includes(q)
      );
    });
  }, [hospitals, hospitalCityFilter, hospitalSearch]);

  // Group filtered hospitals by city with counts for clean optgroups
  const hospitalsByCity = useMemo(() => {
    const map = {};
    filteredHospitals.forEach((h) => {
      const city = h.city || 'Other NCR';
      if (!map[city]) map[city] = [];
      map[city].push(h);
    });
    const order = [
      'New Delhi',
      'Gurugram',
      'Noida',
      'Greater Noida',
      'Ghaziabad',
      'Faridabad',
      'Meerut',
      'Modinagar',
    ];
    const sortedCityNames = Object.keys(map).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
    return sortedCityNames.map((cityName) => ({
      city: cityName,
      list: map[cityName].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [filteredHospitals]);

  // Currently selected hospital object for detail preview
  const selectedHospitalObj = useMemo(() => {
    return hospitals.find((h) => h._id === formData.hospitalId) || null;
  }, [hospitals, formData.hospitalId]);

  const handleHospitalSelect = (selectedId) => {
    const selectedHosp = hospitals.find((h) => h._id === selectedId);
    setFormData((prev) => {
      const updated = { ...prev, hospitalId: selectedId };
      if (selectedHosp) {
        // Auto-sync doctor's practice city and pincode with the affiliated hospital
        if (selectedHosp.city) updated.city = selectedHosp.city;
        if (selectedHosp.state) updated.state = selectedHosp.state;
        if (selectedHosp.pincode) updated.pincode = selectedHosp.pincode;
      }
      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hospitalId') {
      handleHospitalSelect(value);
      return;
    }
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'city') {
        const matched = CITIES.find((c) => c.name === value);
        if (matched) {
          updated.state = matched.state;
          updated.pincode = matched.defaultPin;
        }
      }
      return updated;
    });
  };

  // Live password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'var(--slate-300)' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 30, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score: 65, label: 'Good', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validations
    if (!formData.name.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }
    if (!formData.pincode || formData.pincode.length !== 6) {
      setError('Please enter a valid 6-digit Indian postal pincode.');
      return;
    }
    if (role === 'doctor' && !formData.medicalLicenseNumber.trim()) {
      setError('Medical License / Registration Number is required for doctor verification.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to continue.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role,
        name:
          role === 'doctor'
            ? `Dr. ${formData.name.trim().replace(/^(dr\.?\s*)+/i, '')}`
            : formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        address: formData.address,
      };

      if (role === 'doctor') {
        payload.qualification = formData.qualification;
        payload.specialization = formData.specialization;
        payload.experience = Number(formData.experience) || 1;
        payload.consultationFee = Number(formData.consultationFee) || 500;
        payload.hospitalId = formData.hospitalId;
        payload.medicalLicenseNumber = formData.medicalLicenseNumber;
        payload.shift = formData.shift;
        payload.slotDuration = Number(formData.slotDuration) || 30;
        payload.about = formData.about || `Consultant ${formData.specialization} serving ${formData.city} medical corridor.`;
      }

      const res = await register(payload);

      setSuccessMsg(
        role === 'doctor'
          ? 'Doctor account created & schedule initialized successfully! Redirecting...'
          : 'Patient account created successfully! Redirecting to your appointments...'
      );

      setTimeout(() => {
        if (role === 'doctor') {
          navigate('/doctor/portal');
        } else {
          navigate('/patient/portal');
        }
      }, 1200);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* Top Breadcrumb & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'var(--primary-100)',
              color: 'var(--primary-800)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Official CARE CONNECT Healthcare Registration</span>
          </div>
          <h1 style={{ fontSize: '2.1rem', color: 'var(--slate-900)', fontWeight: 800 }}>
            Create Your Medical Account
          </h1>
          <p style={{ fontSize: '0.98rem', color: 'var(--slate-600)', maxWidth: '640px', margin: '8px auto 0' }}>
            Book OPD consultation slots, consult top verified specialists, and manage digital prescriptions across Delhi, Modinagar, Ghaziabad & Meerut.
          </p>
        </div>

        {/* Two-Column Grid: Left Brand Trust Panel + Right Registration Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 400px) 1fr',
            gap: '32px',
            alignItems: 'start',
          }}
          className="registration-container"
        >

          {/* Left Column: Brand Trust & Network Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="glass-card"
              style={{
                padding: '28px',
                background: 'linear-gradient(145deg, #ffffff 0%, #f0fdfa 100%)',
                borderColor: 'var(--primary-200)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'var(--primary-600)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  <Activity size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                    CARE <span style={{ color: 'var(--primary-600)' }}>CONNECT</span>
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', margin: 0 }}>
                    Healthcare Platform • Delhi NCR & UP
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: '1.5', marginBottom: '20px' }}>
                A verified healthcare appointment portal engineered for instant doctor discovery, real-time slot bookings, and paperless clinical care.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ color: 'var(--primary-600)', marginTop: '2px' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                      Verified Medical Specialists
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0 0' }}>
                      Certified doctors with verified MCI credentials, hospital affiliations, and real patient reviews.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ color: 'var(--primary-600)', marginTop: '2px' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                      Exact Pincode Proximity Engine
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0 0' }}>
                      Locate top clinics & hospitals within 0–50 km of your exact postal area in Delhi, Modinagar, Ghaziabad & Meerut.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ color: 'var(--primary-600)', marginTop: '2px' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                      Instant Slot Confirmation & Rx
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0 0' }}>
                      No waiting in long OPD queues. Get direct digital prescriptions and SMS/email confirmation alerts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Regional Coverage Chips */}
              <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Active Medical Coverage
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  <span className="badge badge-pincode">Delhi (110001)</span>
                  <span className="badge badge-pincode">Modinagar (201204)</span>
                  <span className="badge badge-pincode">Ghaziabad (201001)</span>
                  <span className="badge badge-pincode">Meerut (250004)</span>
                </div>
              </div>
            </div>

            {/* Emergency & Support Card */}
            <div
              className="glass-card"
              style={{
                padding: '20px',
                background: '#ffffff',
                border: '1px solid var(--slate-200)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Phone size={18} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Need Immediate Assistance?
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: '0 0 10px' }}>
                Our 24/7 Connect Desk helps with patient registrations, hospital referrals, and emergency ambulance dispatch.
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                📞 Helpline: +91 98765 43210
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                ✉️ Support: connect@careconnect.in
              </div>
            </div>
          </div>

          {/* Right Column: Main Interactive Registration Card */}
          <div
            className="glass-card"
            style={{
              padding: '36px',
              boxShadow: 'var(--shadow-lg)',
              borderColor: 'var(--slate-200)',
              borderRadius: 'var(--radius-xl)',
              background: '#ffffff',
            }}
          >

            {/* Account Type Selector (Patient vs Doctor) */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '10px' }}>
                Select Account Classification:
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  background: 'var(--slate-100)',
                  padding: '6px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--slate-200)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setRole('patient');
                    setError('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    transition: 'var(--transition)',
                    background: role === 'patient' ? '#ffffff' : 'transparent',
                    color: role === 'patient' ? 'var(--primary-700)' : 'var(--slate-600)',
                    boxShadow: role === 'patient' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <User size={18} style={{ color: role === 'patient' ? 'var(--primary-600)' : 'inherit' }} />
                  <span>Patient / Family</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('doctor');
                    setError('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    transition: 'var(--transition)',
                    background: role === 'doctor' ? '#ffffff' : 'transparent',
                    color: role === 'doctor' ? 'var(--sapphire-700)' : 'var(--slate-600)',
                    boxShadow: role === 'doctor' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <Stethoscope size={18} style={{ color: role === 'doctor' ? 'var(--sapphire-600)' : 'inherit' }} />
                  <span>Doctor / Specialist</span>
                </button>
              </div>

              <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--primary-600)' }} />
                <span>
                  {role === 'patient'
                    ? 'Registering for appointment bookings, digital prescriptions, and personal health records.'
                    : 'Registering as an accredited medical specialist to manage OPD schedules and patient consultations.'}
                </span>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--danger-bg)',
                  color: '#b91c1c',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  border: '1px solid #fecaca',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--success-bg)',
                  color: '#047857',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                  border: '1px solid #a7f3d0',
                }}
              >
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Section 1: Basic Account & Identity */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                  1. Identity & Credentials
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">
                      {role === 'doctor' ? 'Doctor Full Name *' : 'Full Name *'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={role === 'doctor' ? 'e.g. Dr. Rajesh Sharma' : 'e.g. Rahul Sharma'}
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px' }}
                      />
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder={role === 'doctor' ? 'dr.sharma@hospital.com' : 'rahul@example.com'}
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px' }}
                      />
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Mobile Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px' }}
                      />
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-control"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Patient Demographics OR Doctor Credentials */}
              {role === 'patient' ? (
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                    2. Patient Demographics & Health Profile
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Blood Group</label>
                      <select
                        name="bloodGroup"
                        className="form-control"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Emergency Phone</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        className="form-control"
                        placeholder="+91 98111 00000"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                    2. Medical Council Credentials & Specialization
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">MCI / State Medical License No. *</label>
                      <input
                        type="text"
                        name="medicalLicenseNumber"
                        className="form-control"
                        placeholder="e.g. MCI/DMC/2014/99124"
                        value={formData.medicalLicenseNumber}
                        onChange={handleChange}
                        required={role === 'doctor'}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Primary Specialization *</label>
                      <select
                        name="specialization"
                        className="form-control"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      >
                        {SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginTop: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Qualifications *</label>
                      <input
                        type="text"
                        name="qualification"
                        className="form-control"
                        placeholder="e.g. MBBS, MD, DM"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Experience (Years) *</label>
                      <input
                        type="number"
                        name="experience"
                        className="form-control"
                        min="1"
                        max="60"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Consultation Fee (₹ INR) *</label>
                      <input
                        type="number"
                        name="consultationFee"
                        className="form-control"
                        min="100"
                        step="50"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={16} style={{ color: 'var(--primary-600)' }} />
                          <span>Affiliated Hospital / Medical Centre *</span>
                        </label>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#0f766e',
                            background: '#f0fdfa',
                            border: '1px solid #99f6e4',
                            padding: '2px 10px',
                            borderRadius: '12px',
                          }}
                        >
                          🏥 All {hospitals.length || 200} Network Hospitals Available
                        </span>
                      </div>

                      {/* Real-time Hospital Search Input */}
                      <div style={{ position: 'relative', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={hospitalSearch}
                          onChange={(e) => setHospitalSearch(e.target.value)}
                          placeholder="🔍 Search among all 200 hospitals by name, area, or pincode..."
                          className="form-control"
                          style={{ paddingLeft: '34px', fontSize: '0.84rem' }}
                        />
                        <Search
                          size={15}
                          style={{
                            position: 'absolute',
                            left: '11px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--slate-400)',
                          }}
                        />
                        {hospitalSearch && (
                          <button
                            type="button"
                            onClick={() => setHospitalSearch('')}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--slate-400)',
                              cursor: 'pointer',
                              padding: '2px',
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Quick City Filter Pills */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          overflowX: 'auto',
                          paddingBottom: '6px',
                          marginBottom: '8px',
                        }}
                      >
                        {['All', 'New Delhi', 'Gurugram', 'Noida', 'Greater Noida', 'Ghaziabad', 'Faridabad', 'Meerut', 'Modinagar'].map((cName) => {
                          const count = cName === 'All' ? hospitals.length : hospitals.filter((h) => h.city === cName).length;
                          const isSelected = hospitalCityFilter === cName;
                          return (
                            <button
                              key={cName}
                              type="button"
                              onClick={() => setHospitalCityFilter(cName)}
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: isSelected ? 700 : 500,
                                padding: '3px 8px',
                                borderRadius: '14px',
                                border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--slate-200)',
                                background: isSelected ? 'var(--primary-50)' : '#ffffff',
                                color: isSelected ? 'var(--primary-700)' : 'var(--slate-600)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cName} ({count})
                            </button>
                          );
                        })}
                      </div>

                      {/* Grouped Select Dropdown */}
                      <select
                        name="hospitalId"
                        className="form-control"
                        value={formData.hospitalId}
                        onChange={handleChange}
                        required
                        style={{
                          fontWeight: 600,
                          padding: '10px 14px',
                          fontSize: '0.88rem',
                          borderColor: 'var(--primary-300)',
                        }}
                      >
                        {loadingHospitals ? (
                          <option value="">Loading 200 Delhi NCR network hospitals...</option>
                        ) : filteredHospitals.length === 0 ? (
                          <option value="">No hospitals match "{hospitalSearch}" — clear search to see all 200</option>
                        ) : (
                          hospitalsByCity.map((group) => (
                            <optgroup
                              key={group.city}
                              label={`📍 ${group.city} (${group.list.length} Hospitals)`}
                            >
                              {group.list.map((h) => (
                                <option key={h._id} value={h._id}>
                                  {h.name} — {h.area ? `${h.area.split('/')[0].trim()} • ` : ''}Pincode: {h.pincode}
                                </option>
                              ))}
                            </optgroup>
                          ))
                        )}
                      </select>

                      {/* Selected Hospital Preview Card */}
                      {selectedHospitalObj && (
                        <div
                          style={{
                            marginTop: '12px',
                            padding: '14px 16px',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdfa 100%)',
                            border: '1.5px solid var(--primary-200)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Building2 size={16} style={{ color: 'var(--primary-700)' }} />
                              <strong style={{ fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                                {selectedHospitalObj.name}
                              </strong>
                              <CheckCircle2 size={15} style={{ color: '#059669' }} />
                            </div>

                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: '#b45309',
                                background: '#fef3c7',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Star size={12} fill="#d97706" color="#d97706" />
                              <span>{selectedHospitalObj.rating || 4.8} / 5.0</span>
                            </span>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} style={{ color: 'var(--primary-600)' }} />
                              <span>{selectedHospitalObj.address || selectedHospitalObj.area}</span>
                            </span>
                            <span>•</span>
                            <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                              City: {selectedHospitalObj.city}
                            </span>
                            <span>•</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                              Pincode: {selectedHospitalObj.pincode}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                            <Check size={14} />
                            <span>Doctor's regional city and postal pincode have been auto-synced with this hospital.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Geographic Location & Pincode */}
              <div style={{ marginBottom: '22px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                  3. Regional City & Postal Pincode
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Medical Hub City *</label>
                    <select
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      {CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">6-Digit Postal Pincode *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="pincode"
                        maxLength="6"
                        className="form-control"
                        placeholder="e.g. 110001"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px', fontWeight: 700 }}
                      />
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-600)' }} />
                    </div>
                  </div>
                </div>

                {/* Quick Pincode helper pills */}
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginRight: '6px' }}>
                    Quick Select Pincode:
                  </span>
                  <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
                    {QUICK_PINCODES.map((qp) => (
                      <button
                        key={qp.pin}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            pincode: qp.pin,
                            city: qp.label.includes('Modinagar')
                              ? 'Modinagar'
                              : qp.label.includes('Ghaziabad')
                              ? 'Ghaziabad'
                              : qp.label.includes('Meerut')
                              ? 'Meerut'
                              : 'New Delhi',
                          }));
                        }}
                        style={{
                          background: formData.pincode === qp.pin ? 'var(--primary-600)' : 'var(--slate-100)',
                          color: formData.pincode === qp.pin ? '#ffffff' : 'var(--slate-700)',
                          border: '1px solid var(--slate-200)',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {qp.pin} ({qp.label.split(',')[0]})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
                  <label className="form-label">
                    {role === 'doctor' ? 'Clinic / OPD Chamber Address' : 'Residential Address (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="e.g. Sector 12, OPD Block 2, Medical Campus"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section 4: Security & Password */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                  4. Password & Security
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Create Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--slate-400)',
                          cursor: 'pointer',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      />
                      <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--slate-400)',
                          cursor: 'pointer',
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--slate-500)' }}>Password Strength:</span>
                      <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                    </div>
                    <div style={{ height: '5px', width: '100%', background: 'var(--slate-200)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${strength.score}%`,
                          background: strength.color,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Password match check */}
                {formData.confirmPassword && (
                  <div style={{ marginTop: '6px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {formData.password === formData.confirmPassword ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Passwords match
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--primary-600)' }}
                  />
                  <span>
                    I confirm that the information provided is accurate and agree to CARE CONNECT's{' '}
                    <strong style={{ color: 'var(--primary-700)' }}>Terms of Healthcare Service</strong> and{' '}
                    <strong style={{ color: 'var(--primary-700)' }}>Patient Medical Data Confidentiality Policy</strong>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  boxShadow: '0 6px 18px rgba(13, 148, 136, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {loading ? (
                  <span>Processing Registration...</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>
                      {role === 'doctor'
                        ? 'Register as Medical Specialist'
                        : 'Complete Patient Registration'}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link to Sign In */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid var(--slate-100)',
                textAlign: 'center',
                fontSize: '0.88rem',
                color: 'var(--slate-600)',
              }}
            >
              Already registered with CARE CONNECT?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--primary-700)',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Sign In to Your Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
