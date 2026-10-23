import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  Star,
  Award,
  IndianRupee,
  RefreshCw,
  AlertCircle,
  Building,
} from 'lucide-react';
import { searchAPI } from '../../services/api';
import DoctorCard from '../../components/doctor/DoctorCard';
import DoctorProfileModal from '../../components/doctor/DoctorProfileModal';
import BookingModal from '../../components/appointment/BookingModal';

const SPECIALIZATIONS_LIST = [
  'All',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Gynecology & Obstetrics',
  'General Medicine',
  'ENT (Otolaryngology)',
  'Ophthalmology',
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query states
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '');
  const [radius, setRadius] = useState(searchParams.get('radius') || '30');
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || 'All');
  const [minRating, setMinRating] = useState('0');
  const [maxFee, setMaxFee] = useState('2500');
  const [minExperience, setMinExperience] = useState('0');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'nearest');

  // Results & UI states
  const [doctors, setDoctors] = useState([]);
  const [targetPincodeInfo, setTargetPincodeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const DOCTORS_PER_PAGE = 18;

  // Sync state with URL params
  useEffect(() => {
    setPincode(searchParams.get('pincode') || '');
    setRadius(searchParams.get('radius') || '30');
    setQuery(searchParams.get('query') || '');
    setSpecialization(searchParams.get('specialization') || 'All');
    setSortBy(searchParams.get('sortBy') || 'nearest');
  }, [searchParams]);

  const executeSearch = () => {
    setLoading(true);
    setError('');

    const params = {};
    if (pincode) params.pincode = pincode;
    if (radius) params.radius = radius;
    if (query) params.query = query;
    if (specialization && specialization !== 'All') params.specialization = specialization;
    if (minRating && minRating !== '0') params.minRating = minRating;
    if (maxFee) params.maxFee = maxFee;
    if (minExperience && minExperience !== '0') params.minExperience = minExperience;
    if (sortBy) params.sortBy = sortBy;

    searchAPI
      .searchDoctors(params)
      .then((res) => {
        if (res.success) {
          setDoctors(res.data);
          setTargetPincodeInfo(res.targetPincodeInfo);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    executeSearch();
  }, [pincode, radius, query, specialization, minRating, maxFee, minExperience, sortBy]);

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (pincode) newParams.set('pincode', pincode);
    else newParams.delete('pincode');
    newParams.set('radius', radius);
    if (query) newParams.set('query', query);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setPincode('');
    setRadius('30');
    setQuery('');
    setSpecialization('All');
    setMinRating('0');
    setMaxFee('2500');
    setMinExperience('0');
    setSortBy('nearest');
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Search Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-50) 100%)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-pincode">
                <MapPin size={13} />
                Pincode Proximity Search
              </span>
              {targetPincodeInfo && (
                <span style={{ fontSize: '0.82rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                  📍 {targetPincodeInfo.area} ({targetPincodeInfo.city})
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '1.75rem', color: 'var(--slate-900)', marginTop: '6px' }}>
              {pincode
                ? `Doctors near Pincode ${pincode}`
                : 'Browse All Verified Specialist Doctors'}
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', marginTop: '2px' }}>
              Showing {doctors.length} available medical practitioners
              {pincode ? ` within ${radius === '0' ? 'exact pincode' : `${radius} km radius`}` : ''}
            </p>
          </div>

          {/* Quick Pincode Switcher Box */}
          <form onSubmit={handlePincodeSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--primary-600)' }} />
              <input
                type="text"
                placeholder="Change Pincode..."
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="form-control"
                style={{ width: '170px', padding: '8px 12px 8px 32px', fontSize: '0.85rem' }}
              />
            </div>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="form-control"
              style={{ width: '130px', padding: '8px 10px', fontSize: '0.85rem' }}
            >
              <option value="0">Exact Pincode</option>
              <option value="10">Within 10 km</option>
              <option value="30">Within 30 km</option>
              <option value="50">Within 50 km</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              Apply
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Left Filter Sidebar */}
        <div
          className="glass-card"
          style={{
            padding: '22px',
            position: 'sticky',
            top: '80px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
              <SlidersHorizontal size={17} style={{ color: 'var(--primary-600)' }} />
              <span>Filters</span>
            </div>
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-700)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>

          {/* Keyword Search */}
          <div className="form-group">
            <label className="form-label">Doctor / Hospital Keyword</label>
            <input
              type="text"
              placeholder="e.g. Heart, Rajesh..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Specialization Filter */}
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              {SPECIALIZATIONS_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="form-group">
            <label className="form-label">Sort Doctors By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="nearest">Nearest (Pincode Distance)</option>
              <option value="rating_desc">Highest Patient Rating</option>
              <option value="fee_asc">Lowest Consultation Fee</option>
              <option value="fee_desc">Highest Consultation Fee</option>
              <option value="experience_desc">Most Experience</option>
            </select>
          </div>

          {/* Max Consultation Fee Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
              <span className="form-label" style={{ margin: 0 }}>Max Fee:</span>
              <strong style={{ color: 'var(--primary-700)' }}>₹{maxFee}</strong>
            </div>
            <input
              type="range"
              min="500"
              max="2500"
              step="100"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--slate-400)' }}>
              <span>₹500</span>
              <span>₹2,500</span>
            </div>
          </div>

          {/* Minimum Experience Filter */}
          <div className="form-group">
            <label className="form-label">Clinical Experience</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { label: 'Any', value: '0' },
                { label: '5+ Yrs', value: '5' },
                { label: '10+ Yrs', value: '10' },
                { label: '15+ Yrs', value: '15' },
              ].map((exp) => (
                <button
                  key={exp.value}
                  type="button"
                  onClick={() => setMinExperience(exp.value)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: minExperience === exp.value ? '1.5px solid var(--primary-600)' : '1px solid var(--slate-300)',
                    background: minExperience === exp.value ? 'var(--primary-50)' : '#fff',
                    color: minExperience === exp.value ? 'var(--primary-700)' : 'var(--slate-700)',
                    cursor: 'pointer',
                  }}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="form-group">
            <label className="form-label">Doctor Rating</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { label: 'All', value: '0' },
                { label: '4.5+ ⭐', value: '4.5' },
                { label: '4.8+ ⭐', value: '4.8' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setMinRating(r.value)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: minRating === r.value ? '1.5px solid #f59e0b' : '1px solid var(--slate-300)',
                    background: minRating === r.value ? '#fef3c7' : '#fff',
                    color: minRating === r.value ? '#b45309' : 'var(--slate-700)',
                    cursor: 'pointer',
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Doctor Results List */}
        <div>
          {/* Active Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>Active Filters:</span>
            {pincode && (
              <span className="badge badge-pincode">
                📍 Pincode: {pincode} ({radius === '0' ? 'Exact' : `${radius}km`})
              </span>
            )}
            {specialization !== 'All' && (
              <span className="badge badge-specialization">{specialization}</span>
            )}
            {minRating !== '0' && (
              <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>
                ⭐ {minRating}+
              </span>
            )}
            {query && (
              <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                Keyword: "{query}"
              </span>
            )}
          </div>

          {/* Content Loading / Error / Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--slate-500)' }}>
              <RefreshCw size={30} className="spin" style={{ color: 'var(--primary-600)', margin: '0 auto 12px' }} />
              <div>Searching verified doctors in your pincode area...</div>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '24px',
                background: 'var(--danger-bg)',
                borderRadius: 'var(--radius-lg)',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertCircle size={24} />
              <div>{error}</div>
            </div>
          ) : doctors.length === 0 ? (
            <div
              className="glass-card"
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--slate-600)',
              }}
            >
              <MapPin size={42} style={{ color: 'var(--slate-300)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>
                No doctors found matching this criteria
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', maxWidth: '440px', margin: '8px auto 20px' }}>
                Try expanding the distance radius, clearing specialization filters, or searching in an adjacent pincode.
              </p>
              <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                Clear Filters & Show All Doctors
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                  Showing {((currentPage - 1) * DOCTORS_PER_PAGE) + 1}–{Math.min(currentPage * DOCTORS_PER_PAGE, doctors.length)} of {doctors.length} verified doctors
                </span>
                {Math.ceil(doctors.length / DOCTORS_PER_PAGE) > 1 && (
                  <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                    Page {currentPage} of {Math.ceil(doctors.length / DOCTORS_PER_PAGE)}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {doctors.slice((currentPage - 1) * DOCTORS_PER_PAGE, currentPage * DOCTORS_PER_PAGE).map((doc) => (
                  <DoctorCard
                    key={doc._id}
                    doctor={doc}
                    onBookClick={() => {
                      setSelectedDoctorForBooking(doc);
                      setIsBookingOpen(true);
                    }}
                    onViewProfileClick={(docToView) => {
                      setSelectedDoctorForProfile(docToView);
                      setIsProfileOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {Math.ceil(doctors.length / DOCTORS_PER_PAGE) > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '36px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-sm"
                    style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    ← Previous
                  </button>

                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {Array.from({ length: Math.min(7, Math.ceil(doctors.length / DOCTORS_PER_PAGE)) }, (_, idx) => {
                      const totalP = Math.ceil(doctors.length / DOCTORS_PER_PAGE);
                      let pageNum = idx + 1;
                      if (totalP > 7) {
                        if (currentPage > 4 && currentPage < totalP - 3) {
                          pageNum = currentPage - 3 + idx;
                        } else if (currentPage >= totalP - 3) {
                          pageNum = totalP - 6 + idx;
                        }
                      }
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border: isCurrent ? 'none' : '1px solid var(--slate-200)',
                            background: isCurrent ? 'var(--primary-600)' : '#ffffff',
                            color: isCurrent ? '#ffffff' : 'var(--slate-700)',
                            fontWeight: isCurrent ? 700 : 500,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(Math.ceil(doctors.length / DOCTORS_PER_PAGE), p + 1));
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    disabled={currentPage === Math.ceil(doctors.length / DOCTORS_PER_PAGE)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      opacity: currentPage === Math.ceil(doctors.length / DOCTORS_PER_PAGE) ? 0.5 : 1,
                      cursor: currentPage === Math.ceil(doctors.length / DOCTORS_PER_PAGE) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
