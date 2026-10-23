import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, Check, X, ShieldAlert, Search } from 'lucide-react';
import { hospitalAPI } from '../../services/api';

export default function HospitalsManager({ hospitals = [], onRefresh }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    departments: 'Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine',
    facilities: '24/7 Emergency, ICU, Radiology MRI, Pharmacy, Pathology Lab',
    openingHours: '24 Hours Emergency / OPD 08:30 AM - 08:00 PM',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddHospitalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        departments: formData.departments.split(',').map((d) => d.trim()),
        facilities: formData.facilities.split(',').map((f) => f.trim()),
      };

      const res = await hospitalAPI.createHospital(payload);
      if (res.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          address: '',
          area: '',
          city: '',
          state: '',
          pincode: '',
          departments: 'Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine',
          facilities: '24/7 Emergency, ICU, Radiology MRI, Pharmacy, Pathology Lab',
          openingHours: '24 Hours Emergency / OPD 08:30 AM - 08:00 PM',
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHospital = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this hospital?')) {
      try {
        await hospitalAPI.deleteHospital(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const filteredHospitals = hospitals.filter((h) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (h.name || '').toLowerCase().includes(q) ||
      (h.city || '').toLowerCase().includes(q) ||
      (h.pincode || '').includes(q) ||
      (h.area || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredHospitals.length / ITEMS_PER_PAGE);
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>
            Hospital Master Registry ({hospitals.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Manage hospital infrastructure, departments and assigned pincodes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search hospital, city, pincode..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control"
              style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
            />
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Hospital</span>
          </button>
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: 'var(--slate-50)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Hospital Name</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Pincode & City</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Contact</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Departments</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHospitals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>
                  No hospitals matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              paginatedHospitals.map((h) => (
                <tr key={h._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--slate-900)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} style={{ color: 'var(--primary-600)' }} />
                      <span>{h.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge badge-pincode" style={{ fontSize: '0.75rem' }}>
                      📍 {h.pincode}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {h.city}, {h.state}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--slate-600)' }}>
                    {h.contactNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(h.departments || []).slice(0, 2).map((d, i) => (
                        <span key={i} className="badge badge-specialization" style={{ fontSize: '0.7rem' }}>
                          {d}
                        </span>
                      ))}
                      {(h.departments || []).length > 2 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                          +{h.departments.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${h.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                      {h.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteHospital(h._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: h.isActive ? '#ef4444' : 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Deactivate Hospital"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredHospitals.length)} of {filteredHospitals.length} hospitals
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              Previous
            </button>
            <span style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', padding: '0 8px', color: 'var(--slate-700)', fontWeight: 600 }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--slate-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>Add New Partner Hospital</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddHospitalSubmit} style={{ padding: '20px' }}>
              {error && (
                <div style={{ padding: '10px', background: 'var(--danger-bg)', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '14px' }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Hospital Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Max Super Speciality Hospital"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Contact Number *</label>
                  <input
                    type="text"
                    name="contactNumber"
                    className="form-control"
                    placeholder="+91 11 2692 5858"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="contact@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="e.g. 1 Press Enclave Road, Saket"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-control"
                    placeholder="110001"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="New Delhi"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="Delhi"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Departments (comma separated)</label>
                <input
                  type="text"
                  name="departments"
                  className="form-control"
                  value={formData.departments}
                  onChange={handleInputChange}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
                  {loading ? 'Creating...' : 'Save Hospital'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
