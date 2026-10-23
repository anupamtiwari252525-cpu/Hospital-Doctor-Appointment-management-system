import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, ChevronRight, Compass } from 'lucide-react';
import { searchAPI } from '../../services/api';

export default function PincodeSearchBar({ initialPincode = '', initialQuery = '', onSearch }) {
  const [pincode, setPincode] = useState(initialPincode);
  const [query, setQuery] = useState(initialQuery);
  const [radius, setRadius] = useState('30');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    setPincode(initialPincode);
  }, [initialPincode]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Fetch suggestions when user types in pincode field
  useEffect(() => {
    if (pincode && pincode.length >= 2) {
      searchAPI
        .getPincodes(pincode)
        .then((res) => {
          if (res.success) {
            setSuggestions(res.data);
          }
        })
        .catch(() => {});
    } else {
      setSuggestions([]);
    }
  }, [pincode]);

  // Close suggestion dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);

    if (onSearch) {
      onSearch({ pincode, query, radius });
    } else {
      const params = new URLSearchParams();
      if (pincode) params.set('pincode', pincode);
      if (query) params.set('query', query);
      if (radius) params.set('radius', radius);
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleSelectSuggestion = (item) => {
    setPincode(item.pincode);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch({ pincode: item.pincode, query, radius });
    } else {
      navigate(`/search?pincode=${item.pincode}&radius=${radius}`);
    }
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', position: 'relative' }}>
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 180px auto',
          gap: '8px',
          background: '#ffffff',
          padding: '8px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
          border: '1.5px solid var(--slate-200)',
          alignItems: 'center',
        }}
      >
        {/* Pincode Input Box */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <MapPin
            size={20}
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--primary-600)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Enter Pincode (e.g. 110001 Delhi, 201204 Modinagar, 201001 Ghaziabad, 250004 Meerut)..."
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            style={{
              width: '100%',
              padding: '13px 14px 13px 42px',
              fontSize: '0.94rem',
              fontWeight: 600,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--slate-900)',
            }}
          />
          {pincode && (
            <button
              type="button"
              onClick={() => {
                setPincode('');
                setShowSuggestions(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--slate-400)',
                cursor: 'pointer',
                paddingRight: '12px',
                fontSize: '0.9rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Doctor Name / Specialization Input */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            borderLeft: '1px solid var(--slate-200)',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--slate-400)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Doctor name, hospital or symptom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 14px 13px 40px',
              fontSize: '0.94rem',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--slate-900)',
            }}
          />
        </div>

        {/* Radius Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderLeft: '1px solid var(--slate-200)',
            paddingLeft: '12px',
          }}
        >
          <Compass size={17} style={{ color: 'var(--slate-500)', marginRight: '6px' }} />
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <option value="0">Exact Pincode</option>
            <option value="10">Within 10 km</option>
            <option value="30">Within 30 km</option>
            <option value="50">Within 50 km</option>
            <option value="100">Any Distance</option>
          </select>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '13px 24px', borderRadius: 'var(--radius-lg)' }}
        >
          <Search size={18} />
          <span>Find Doctors</span>
        </button>
      </form>

      {/* Pincode Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            maxWidth: '480px',
            width: '100%',
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--slate-200)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--slate-50)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--slate-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Matching Pincodes & Locations
          </div>
          <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {suggestions.map((item) => (
              <div
                key={item.pincode}
                onClick={() => handleSelectSuggestion(item)}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--slate-50)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {item.pincode}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      {item.area}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                      {item.city}, {item.state}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.hospitalCount > 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                      {item.hospitalCount} {item.hospitalCount === 1 ? 'Hospital' : 'Hospitals'}
                    </span>
                  )}
                  <ChevronRight size={16} style={{ color: 'var(--slate-400)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
