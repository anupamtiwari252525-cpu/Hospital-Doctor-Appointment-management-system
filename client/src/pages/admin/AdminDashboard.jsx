import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Activity,
  Building2,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  TrendingUp,
  RefreshCw,
  MapPin,
  Stethoscope,
  PieChart,
  Clock,
  IndianRupee,
  Layers,
} from 'lucide-react';
import { adminAPI, hospitalAPI, doctorAPI, appointmentAPI } from '../../services/api';
import AdminStatsCards from '../../components/admin/AdminStatsCards';
import HospitalsManager from '../../components/admin/HospitalsManager';
import DoctorsManager from '../../components/admin/DoctorsManager';
import UsersManager from '../../components/admin/UsersManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'hospitals', 'doctors', 'users', 'appointments'
  const [chartView, setChartView] = useState('cities'); // 'cities', 'monthly', 'specializations'
  const [dashboardData, setDashboardData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const DELHI_NCR_CITIES = [
    'New Delhi',
    'Noida',
    'Gurugram',
    'Ghaziabad',
    'Faridabad',
    'Greater Noida',
    'Meerut',
    'Modinagar',
  ];

  const citiesData = useMemo(() => {
    return DELHI_NCR_CITIES.map((cityName) => {
      const hospCount = hospitals.filter(
        (h) => (h.city || '').toLowerCase() === cityName.toLowerCase()
      ).length || (dashboardData?.hospitalsByCity?.find(c => c._id?.toLowerCase() === cityName.toLowerCase())?.count || 0);

      const docCount = doctors.filter(
        (d) =>
          (d.hospitalId?.city || d.userId?.city || '').toLowerCase() === cityName.toLowerCase()
      ).length || (dashboardData?.doctorsByCity?.find(c => c._id?.toLowerCase() === cityName.toLowerCase())?.count || 0);

      return {
        city: cityName,
        hospitals: hospCount,
        doctors: docCount,
      };
    });
  }, [hospitals, doctors, dashboardData]);

  const maxCityVal = useMemo(() => {
    return Math.max(...citiesData.map((c) => Math.max(c.hospitals, c.doctors)), 1);
  }, [citiesData]);

  const specializationsData = useMemo(() => {
    if (dashboardData?.topSpecializations && dashboardData.topSpecializations.length > 0) {
      return dashboardData.topSpecializations;
    }
    const specMap = {};
    doctors.forEach((d) => {
      const spec = d.specialization || 'General Medicine';
      if (!specMap[spec]) {
        specMap[spec] = { count: 0, totalFee: 0 };
      }
      specMap[spec].count += 1;
      specMap[spec].totalFee += (d.consultationFee || 800);
    });
    return Object.keys(specMap).map((k) => ({
      _id: k,
      count: specMap[k].count,
      avgFee: Math.round(specMap[k].totalFee / specMap[k].count),
    })).sort((a, b) => b.count - a.count);
  }, [dashboardData, doctors]);

  const maxSpecCount = useMemo(() => {
    return Math.max(...specializationsData.map((s) => s.count), 1);
  }, [specializationsData]);

  const monthlyList = dashboardData?.monthlyOverview || [];
  const maxMonthly = useMemo(() => {
    return Math.max(...monthlyList.map((m) => m.appointments), 1);
  }, [monthlyList]);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAdminData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [dashRes, hospRes, docRes, userRes, aptRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        hospitalAPI.getAllHospitals(),
        doctorAPI.getAllDoctors(),
        adminAPI.getAllUsers(),
        appointmentAPI.getAppointments(),
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (hospRes.success) setHospitals(hospRes.data);
      if (docRes.success) setDoctors(docRes.data);
      if (userRes.success) setUsers(userRes.data);
      if (aptRes.success) setAppointments(aptRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Admin data sync failed:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Live Auto-Refresh every 10 seconds: ensures automatic change is visible on admin panel
    const interval = setInterval(() => {
      fetchAdminData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      
      {/* Admin Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <Shield size={13} />
              Administrative Governance Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', color: 'var(--slate-900)', marginTop: '4px' }}>
            Hospital System Master Management Portal
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              color: '#0d9488',
              fontWeight: 600,
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              padding: '6px 12px',
              borderRadius: '999px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span>Live Auto-Sync Active (10s)</span>
          </div>

          <button onClick={() => fetchAdminData(false)} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Syncing...' : 'Refresh Now'}</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div style={{ marginBottom: '28px' }}>
        <AdminStatsCards counts={dashboardData?.counts || {}} />
      </div>

      {/* Admin Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--slate-200)',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'overview', label: 'Analytics & Trends', icon: BarChart3 },
          { key: 'hospitals', label: `Hospitals (${hospitals.length})`, icon: Building2 },
          { key: 'doctors', label: `Doctors (${doctors.length})`, icon: UserCheck },
          { key: 'users', label: `User Accounts (${users.length})`, icon: Users },
          { key: 'appointments', label: `All Appointments (${appointments.length})`, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid var(--sapphire-600)' : '3px solid transparent',
                color: isActive ? 'var(--sapphire-700)' : 'var(--slate-500)',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: '-2px',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
          
          {/* Main Dynamic Chart Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            {/* Chart Header & View Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.18rem', color: 'var(--slate-900)', fontWeight: 800 }}>
                  {chartView === 'cities' && 'Delhi NCR Regional Healthcare Distribution'}
                  {chartView === 'monthly' && 'Appointment Volume & Patient Consultation Trends'}
                  {chartView === 'specializations' && 'Clinical Department Specialist Capacity'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                  {chartView === 'cities' && 'Live comparison of partner hospitals & verified doctors across all 8 territories'}
                  {chartView === 'monthly' && 'Month-on-month consultation requests with revenue growth curve'}
                  {chartView === 'specializations' && 'Headcount distribution and average consultation fee across medical departments'}
                </p>
              </div>

              {/* View Toggle Buttons */}
              <div style={{ display: 'flex', background: 'var(--slate-100)', padding: '3px', borderRadius: '10px', gap: '4px' }}>
                <button
                  onClick={() => setChartView('cities')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: chartView === 'cities' ? '#ffffff' : 'transparent',
                    color: chartView === 'cities' ? 'var(--primary-700)' : 'var(--slate-600)',
                    boxShadow: chartView === 'cities' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Regional Hubs (8)
                </button>
                <button
                  onClick={() => setChartView('monthly')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: chartView === 'monthly' ? '#ffffff' : 'transparent',
                    color: chartView === 'monthly' ? 'var(--primary-700)' : 'var(--slate-600)',
                    boxShadow: chartView === 'monthly' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Monthly Volume
                </button>
                <button
                  onClick={() => setChartView('specializations')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: chartView === 'specializations' ? '#ffffff' : 'transparent',
                    color: chartView === 'specializations' ? 'var(--primary-700)' : 'var(--slate-600)',
                    boxShadow: chartView === 'specializations' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Departments (9)
                </button>
              </div>
            </div>

            {/* CHART VIEW 1: Delhi NCR Regional Hubs (City-wise) */}
            {chartView === 'cities' && (
              <div>
                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '18px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(180deg, #0d9488 0%, #0f766e 100%)' }} />
                    <span style={{ color: 'var(--slate-700)' }}>Hospitals ({hospitals.length || 200})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)' }} />
                    <span style={{ color: 'var(--slate-700)' }}>Doctors ({doctors.length || 1000})</span>
                  </div>
                </div>

                {/* Bars Container */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '240px', padding: '10px 0', borderBottom: '1px solid var(--slate-200)' }}>
                  {citiesData.map((item, idx) => {
                    const hospHeight = Math.max(10, Math.min(100, Math.round((item.hospitals / maxCityVal) * 100)));
                    const docHeight = Math.max(10, Math.min(100, Math.round((item.doctors / maxCityVal) * 100)));

                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        {/* Two Bars Side by Side */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', justifyContent: 'center', height: '100%' }}>
                          {/* Hospital Bar */}
                          <div style={{ flex: 1, maxWidth: '20px', height: `${hospHeight}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0f766e', marginBottom: '2px' }}>
                              {item.hospitals}
                            </div>
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(180deg, #0d9488 0%, #0f766e 100%)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.4s ease',
                              }}
                              title={`${item.city}: ${item.hospitals} Hospitals`}
                            />
                          </div>

                          {/* Doctor Bar */}
                          <div style={{ flex: 1, maxWidth: '20px', height: `${docHeight}%`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1e40af', marginBottom: '2px' }}>
                              {item.doctors}
                            </div>
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.4s ease',
                              }}
                              title={`${item.city}: ${item.doctors} Doctors`}
                            />
                          </div>
                        </div>

                        {/* City Name Label */}
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--slate-600)',
                            fontWeight: 700,
                            marginTop: '8px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '75px',
                          }}
                          title={item.city}
                        >
                          {item.city.replace('Greater ', 'Gr. ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CHART VIEW 2: Monthly Appointment Volume & Trend */}
            {chartView === 'monthly' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '240px', padding: '10px 0', borderBottom: '1px solid var(--slate-200)' }}>
                  {monthlyList.map((m, i) => {
                    const heightPercent = Math.max(14, Math.min(100, Math.round((m.appointments / maxMonthly) * 100)));
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                          {m.appointments}
                        </div>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '44px',
                            height: `${heightPercent}%`,
                            background: 'linear-gradient(180deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.5s ease',
                            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)',
                          }}
                          title={`${m.month}: ${m.appointments} visits (₹${m.revenue.toLocaleString()})`}
                        />
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-700)', fontWeight: 700 }}>
                          {m.month}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  <span>* Dynamic aggregation calculated from current consultation slot bookings</span>
                  <span className="badge badge-completed">Live Trend: Positive</span>
                </div>
              </div>
            )}

            {/* CHART VIEW 3: Specializations & Doctor Capacity */}
            {chartView === 'specializations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto', paddingRight: '6px' }}>
                {specializationsData.map((spec, i) => {
                  const percent = Math.round((spec.count / (doctors.length || 1000)) * 100);
                  const barWidth = Math.max(12, Math.round((spec.count / maxSpecCount) * 100));
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{spec._id}</span>
                        <div style={{ display: 'flex', gap: '12px', color: 'var(--slate-500)', fontSize: '0.78rem' }}>
                          <span><strong>{spec.count}</strong> Clinicians ({percent}%)</span>
                          <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Avg ₹{spec.avgFee || 800}</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${barWidth}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--primary-500) 0%, var(--primary-700) 100%)',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Breakdown Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Status Breakdown Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', fontWeight: 700 }}>
                  Appointment Status Distribution
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                  Total: {appointments.length || dashboardData?.counts?.totalAppointments || 0}
                </span>
              </div>

              {/* Multi-segmented Progress Bar */}
              {(() => {
                const total = Math.max(
                  1,
                  (dashboardData?.statusDistribution?.completed || 0) +
                  (dashboardData?.statusDistribution?.confirmed || 0) +
                  (dashboardData?.statusDistribution?.pending || 0) +
                  (dashboardData?.statusDistribution?.cancelled || 0)
                );
                const pComp = ((dashboardData?.statusDistribution?.completed || 0) / total) * 100;
                const pConf = ((dashboardData?.statusDistribution?.confirmed || 0) / total) * 100;
                const pPend = ((dashboardData?.statusDistribution?.pending || 0) / total) * 100;
                const pCanc = ((dashboardData?.statusDistribution?.cancelled || 0) / total) * 100;

                return (
                  <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', margin: '14px 0', background: 'var(--slate-100)' }}>
                    <div style={{ width: `${pComp}%`, background: '#10b981' }} title={`Completed: ${Math.round(pComp)}%`} />
                    <div style={{ width: `${pConf}%`, background: '#2563eb' }} title={`Confirmed: ${Math.round(pConf)}%`} />
                    <div style={{ width: `${pPend}%`, background: '#f59e0b' }} title={`Pending: ${Math.round(pPend)}%`} />
                    <div style={{ width: `${pCanc}%`, background: '#ef4444' }} title={`Cancelled: ${Math.round(pCanc)}%`} />
                  </div>
                );
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Completed', count: dashboardData?.statusDistribution?.completed || 0, color: '#10b981' },
                  { label: 'Confirmed', count: dashboardData?.statusDistribution?.confirmed || 0, color: '#2563eb' },
                  { label: 'Pending Request', count: dashboardData?.statusDistribution?.pending || 0, color: '#f59e0b' },
                  { label: 'Cancelled', count: dashboardData?.statusDistribution?.cancelled || 0, color: '#ef4444' },
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color }} />
                      <span style={{ color: 'var(--slate-700)', fontWeight: 500 }}>{s.label}</span>
                    </div>
                    <strong style={{ color: 'var(--slate-900)' }}>{s.count}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Shift Distribution Card */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', fontWeight: 700 }}>
                  Doctor OPD Shift Roster
                </h3>
                <span className="badge badge-specialization">1,000 Clinicians</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(() => {
                  const morningCount = dashboardData?.doctorsByShift?.find(s => s._id === 'Morning')?.count || doctors.filter(d => d.shift === 'Morning').length || 335;
                  const eveningCount = dashboardData?.doctorsByShift?.find(s => s._id === 'Evening')?.count || doctors.filter(d => d.shift === 'Evening').length || 333;
                  const bothCount = dashboardData?.doctorsByShift?.find(s => s._id === 'Both')?.count || doctors.filter(d => d.shift === 'Both').length || 333;

                  return [
                    { shift: 'Morning Shift', hours: '09:00 AM - 05:00 PM', count: morningCount, color: '#0d9488' },
                    { shift: 'Evening Shift', hours: '02:00 PM - 08:00 PM', count: eveningCount, color: '#8b5cf6' },
                    { shift: 'Dual / Both Shifts', hours: 'Flexible Active OPD', count: bothCount, color: '#f59e0b' },
                  ].map((sh, idx) => (
                    <div key={idx} style={{ padding: '8px 10px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-100)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{sh.shift}</span>
                        <strong style={{ color: sh.color }}>{sh.count} Doctors</strong>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        {sh.hours}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hospitals Manager */}
      {activeTab === 'hospitals' && (
        <HospitalsManager hospitals={hospitals} onRefresh={fetchAdminData} />
      )}

      {/* Tab 3: Doctors Manager */}
      {activeTab === 'doctors' && (
        <DoctorsManager doctors={doctors} onRefresh={fetchAdminData} />
      )}

      {/* Tab 4: Users Manager */}
      {activeTab === 'users' && (
        <UsersManager users={users} onRefresh={fetchAdminData} />
      )}

      {/* Tab 5: All Appointments Registry */}
      {activeTab === 'appointments' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'var(--slate-50)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Apt ID</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Patient</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Doctor</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Hospital / Pincode</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Date & Slot</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Fee</th>
                <th style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => {
                const patient = apt.patientId || {};
                const doctor = apt.doctorId || {};
                const doctorUser = doctor.userId || {};
                const hospital = apt.hospitalId || {};

                return (
                  <tr key={apt._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary-700)' }}>
                      {apt.appointmentNumber}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{patient.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>{patient.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                        {doctorUser.name ? `Dr. ${doctorUser.name.replace(/^(dr\.?\s*)+/i, '')}` : 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{doctor.specialization}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ color: 'var(--slate-800)' }}>{hospital.name}</div>
                      <span className="badge badge-pincode" style={{ fontSize: '0.7rem' }}>
                        📍 {hospital.pincode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>{apt.date}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{apt.timeSlot}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--slate-900)' }}>
                      ₹{apt.fee}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
