import React, { useState } from 'react';
import { Users, Search, Ban, CheckCircle, Shield } from 'lucide-react';
import { adminAPI } from '../../services/api';

export default function UsersManager({ users = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loadingId, setLoadingId] = useState(null);

  const handleToggleBlock = async (id) => {
    setLoadingId(id);
    try {
      await adminAPI.toggleUserBlock(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.pincode && u.pincode.includes(search));
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>
            User Account Management ({filteredUsers.length})
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Monitor accounts, access permissions, and account status
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-control"
            style={{ width: '130px', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Admins</option>
          </select>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search user / email / pincode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px', width: '220px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: 'var(--slate-50)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>User</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Role</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Contact / Email</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Pincode</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Status</th>
              <th style={{ padding: '12px 16px', color: 'var(--slate-600)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={u.name}
                      style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>
                        Joined: {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    className="badge"
                    style={{
                      background: u.role === 'admin' ? '#eff6ff' : u.role === 'doctor' ? 'var(--primary-50)' : 'var(--slate-100)',
                      color: u.role === 'admin' ? '#1d4ed8' : u.role === 'doctor' ? 'var(--primary-700)' : 'var(--slate-700)',
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>
                  <div>{u.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{u.phone || 'N/A'}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {u.pincode ? (
                    <span className="badge badge-pincode" style={{ fontSize: '0.72rem' }}>
                      📍 {u.pincode}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--slate-400)' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge ${u.isBlocked ? 'badge-cancelled' : 'badge-completed'}`}>
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleBlock(u._id)}
                      disabled={loadingId === u._id}
                      className={`btn btn-sm ${u.isBlocked ? 'btn-primary' : 'btn-danger'}`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {u.isBlocked ? 'Unblock' : 'Block User'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
