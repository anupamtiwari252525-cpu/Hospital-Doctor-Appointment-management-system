import React, { useState, useEffect } from 'react';
import { Building2, Search, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { hospitalAPI } from '../../services/api';
import HospitalCard from '../../components/hospital/HospitalCard';

const CITIES_LIST = [
  'All',
  'New Delhi',
  'Noida',
  'Greater Noida',
  'Gurugram',
  'Ghaziabad',
  'Faridabad',
  'Meerut',
  'Modinagar',
];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [pincode, setPincode] = useState('');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const HOSPITALS_PER_PAGE = 15;

  const fetchHospitals = () => {
    setLoading(true);
    const params = {};
    if (pincode) params.pincode = pincode;
    if (query) params.query = query;
    if (city && city !== 'All') params.city = city;

    hospitalAPI
      .getAllHospitals(params)
      .then((res) => {
        if (res.success) {
          setHospitals(res.data);
          setCurrentPage(1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHospitals();
  }, [pincode, city]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  const totalPages = Math.ceil(hospitals.length / HOSPITALS_PER_PAGE);
  const paginatedHospitals = hospitals.slice(
    (currentPage - 1) * HOSPITALS_PER_PAGE,
    currentPage * HOSPITALS_PER_PAGE
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--sapphire-600)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Healthcare Network
        </span>
        <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)', marginTop: '4px' }}>
          Partner Hospitals & Medical Centres
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginTop: '4px' }}>
          Explore 200 accredited tertiary, multi-speciality, and teaching hospital institutes across the Delhi NCR region with live doctor consultations.
        </p>
      </div>

      {/* Hospital Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="glass-card"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 180px auto',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '26px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <MapPin
            size={18}
            style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--primary-600)' }}
          />
          <input
            type="text"
            placeholder="Search by Delhi NCR Pincode (e.g. 110001, 201301, 122001, 201010)..."
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--slate-400)' }}
          />
          <input
            type="text"
            placeholder="Hospital name or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
          />
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="form-control"
          style={{ fontSize: '0.88rem' }}
        >
          {CITIES_LIST.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Cities' : c}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
          Search
        </button>
      </form>

      {/* Active Count & Pagination Header */}
      {!loading && hospitals.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.86rem', color: 'var(--slate-600)', fontWeight: 600 }}>
            Showing {((currentPage - 1) * HOSPITALS_PER_PAGE) + 1}–{Math.min(currentPage * HOSPITALS_PER_PAGE, hospitals.length)} of {hospitals.length} partner hospitals
          </span>
          {totalPages > 1 && (
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--slate-500)' }}>
          <RefreshCw
            size={28}
            className="spin"
            style={{ color: 'var(--primary-600)', margin: '0 auto 12px' }}
          />
          <div>Loading accredited hospitals...</div>
        </div>
      ) : hospitals.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--slate-500)' }}
        >
          <Building2 size={38} style={{ color: 'var(--slate-300)', margin: '0 auto 12px' }} />
          <h3>No hospitals found in this search criteria</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', marginTop: '4px' }}>
            Try selecting "All Cities" or searching with a different pincode.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {paginatedHospitals.map((hosp) => (
              <HospitalCard key={hosp._id} hospital={hosp} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '40px',
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
                style={{
                  opacity: currentPage === 1 ? 0.5 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>

              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {Array.from({ length: Math.min(8, totalPages) }, (_, idx) => {
                  let pageNum = idx + 1;
                  if (totalPages > 8) {
                    if (currentPage > 4 && currentPage < totalPages - 3) {
                      pageNum = currentPage - 4 + idx;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 7 + idx;
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
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
                style={{
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
