import React from 'react';
import { Users, UserCheck, Building2, Calendar, TrendingUp, IndianRupee } from 'lucide-react';

export default function AdminStatsCards({ counts = {} }) {
  const stats = [
    {
      title: 'Total Appointments',
      value: counts.totalAppointments ?? 0,
      icon: Calendar,
      color: '#0d9488',
      bg: '#ccfbf1',
      trend: '+18% this month',
    },
    {
      title: 'Total Revenue',
      value: `₹${(counts.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: '#2563eb',
      bg: '#dbeafe',
      trend: 'Verified paid visits',
    },
    {
      title: 'Registered Doctors',
      value: counts.totalDoctors ?? 0,
      sub: `${counts.verifiedDoctors || 0} Verified`,
      icon: UserCheck,
      color: '#10b981',
      bg: '#ecfdf5',
      trend: 'Active clinicians',
    },
    {
      title: 'Partner Hospitals',
      value: counts.totalHospitals ?? 0,
      icon: Building2,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      trend: 'Across multiple pincodes',
    },
    {
      title: 'Total Users & Patients',
      value: counts.totalUsers ?? 0,
      sub: `${counts.totalPatients || 0} Patients`,
      icon: Users,
      color: '#f59e0b',
      bg: '#fef3c7',
      trend: 'Registered network',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-500)' }}>
                {s.title}
              </span>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: s.bg,
                  color: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.1 }}>
                {s.value}
              </div>
              {s.sub && (
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  {s.sub}
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.74rem', color: s.color, fontWeight: 700 }}>
              {s.trend}
            </div>
          </div>
        );
      })}
    </div>
  );
}
