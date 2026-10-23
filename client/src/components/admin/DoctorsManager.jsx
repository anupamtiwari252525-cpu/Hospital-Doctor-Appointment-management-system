import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ShieldAlert, Check, X, MapPin, IndianRupee, Search } from 'lucide-react';
import { doctorAPI } from '../../services/api';

export default function DoctorsManager({ doctors = [], onRefresh }) {
  const [loadingId, setLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const handleToggleVerify = async (id) => {
    setLoadingId(id);
    try {
      await doctorAPI.toggleVerify(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleStatus = async (id) => {
    setLoadingId(id);
    try {
      await doctorAPI.toggleStatus(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (d.userId?.name || '').toLowerCase();
    const spec = (d.specialization || '').toLowerCase();
    const hosp = (d.hospitalId?.name || '').toLowerCase();
    const city = (d.hospitalId?.city || '').toLowerCase();
    return name.includes(q) || spec.includes(q) || hosp.includes(q) || city.includes(q);
  });

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>
            Doctor Profiles & Verification ({doctors.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Control doctor medical credentials, verification status, and hospital assignments
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--slate-400)' }} />
          <input
            type="text"
            placeholder="Search name, hospital, specialization..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control"
            style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: 'var(--slate-50)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Doctor Details</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Specialization</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Hospital & Pincode</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Fee</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Verification</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDoctors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>
                  No doctors matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              paginatedDoctors.map((d) => {
                const user = d.userId || {};
                const hospital = d.hospitalId || {};
                return (
                  <tr key={d._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80'}
                          alt={user.name}
                          style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{user.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{d.qualification}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-specialization">{d.specialization}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '2px' }}>
                        {d.experience} Years Exp
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{hospital.name || 'N/A'}</div>
                      <span className="badge badge-pincode" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                        📍 {hospital.pincode || d.hospitalPincode || '110001'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                      ₹{d.consultationFee}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${d.isVerified ? 'badge-confirmed' : 'badge-pending'}`}>
                        {d.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${d.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleVerify(d._id)}
                          disabled={loadingId === d._id}
                          className={`btn btn-sm ${d.isVerified ? 'btn-secondary' : 'btn-outline'}`}
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="Toggle Verification"
                        >
                          {d.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleToggleStatus(d._id)}
                          disabled={loadingId === d._id}
                          className={`btn btn-sm ${d.isActive ? 'btn-danger' : 'btn-primary'}`}
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="Toggle Active Status"
                        >
                          {d.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredDoctors.length)} of {filteredDoctors.length} doctors
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
    </div>
  );
}
