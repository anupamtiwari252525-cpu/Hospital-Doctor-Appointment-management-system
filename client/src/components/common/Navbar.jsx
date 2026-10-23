import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  MapPin,
  Calendar,
  User,
  Bell,
  LogOut,
  Shield,
  Stethoscope,
  ChevronDown,
  Sparkles,
  Check,
  Building2,
  Phone,
  Mail,
  UserPlus,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function Navbar() {
  const { user, isAuthenticated, isDoctor, isAdmin, isPatient, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/portal';
    if (isDoctor) return '/doctor/portal';
    return '/patient/portal';
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main Navigation Bar */}
      <div className="glass-nav">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            
            {/* Logo & Brand: CARE CONNECT */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.35)',
                }}
              >
                <Activity size={24} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.42rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  CARE <span style={{ color: 'var(--primary-600)' }}>CONNECT</span>
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--primary-700)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Healthcare Simplified
                </div>
              </div>
            </Link>

            {/* Navigation Links: Serial Order (1. Home, 2. About, 3. Doctor, 4. Hospital) */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: location.pathname === '/' ? 'var(--primary-600)' : 'var(--slate-700)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: location.pathname === '/' ? 'var(--primary-50)' : 'transparent',
                }}
              >
                <Home size={16} style={{ color: 'var(--primary-600)' }} />
                <span>Home</span>
              </Link>

              <Link
                to="/about"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: location.pathname === '/about' ? 'var(--primary-600)' : 'var(--slate-700)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: location.pathname === '/about' ? 'var(--primary-50)' : 'transparent',
                }}
              >
                <Shield size={16} style={{ color: 'var(--primary-600)' }} />
                <span>About</span>
              </Link>

              <Link
                to="/search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: location.pathname === '/search' ? 'var(--primary-600)' : 'var(--slate-700)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: location.pathname === '/search' ? 'var(--primary-50)' : 'transparent',
                }}
              >
                <Stethoscope size={16} style={{ color: 'var(--primary-600)' }} />
                <span>Doctor</span>
              </Link>

              <Link
                to="/hospitals"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: location.pathname === '/hospitals' ? 'var(--primary-600)' : 'var(--slate-700)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: location.pathname === '/hospitals' ? 'var(--primary-50)' : 'transparent',
                }}
              >
                <Building2 size={16} style={{ color: 'var(--sapphire-600)' }} />
                <span>Hospital</span>
              </Link>

              <Link
                to={isAuthenticated && isAdmin ? '/admin/portal' : '/admin/login'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: location.pathname.startsWith('/admin') ? '#1d4ed8' : 'var(--slate-700)',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  background: location.pathname.startsWith('/admin') ? '#eff6ff' : 'transparent',
                  border: location.pathname.startsWith('/admin') ? '1px solid #bfdbfe' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Shield size={16} style={{ color: '#2563eb' }} />
                <span>Admin Panel</span>
              </Link>
            </nav>

          {/* Right Section: Actions & User Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Notifications Popover */}
            {isAuthenticated && (
              <div style={{ position: 'relative' }} ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--slate-100)',
                    border: '1px solid var(--slate-200)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-700)',
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '340px',
                      background: '#ffffff',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                        Notifications ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary-600)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              if (n.link) navigate(n.link);
                              setShowNotifications(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid var(--slate-50)',
                              cursor: 'pointer',
                              background: n.isRead ? '#ffffff' : 'var(--primary-50)',
                              transition: 'background 0.2s',
                            }}
                          >
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                              {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Dropdown or Auth Buttons */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--slate-100)',
                    border: '1px solid var(--slate-200)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-900)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isAdmin ? '#2563eb' : isDoctor ? '#0d9488' : '#64748b',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown size={14} style={{ color: 'var(--slate-500)' }} />
                </button>

                {showProfileMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '230px',
                      background: '#ffffff',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      zIndex: 100,
                      padding: '8px',
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--slate-100)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{user.email}</div>
                      {user.pincode && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary-700)', marginTop: '2px', fontWeight: 600 }}>
                          📍 Pincode: {user.pincode}
                        </div>
                      )}
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setShowProfileMenu(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--slate-700)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      <Activity size={16} />
                      <span>{isAdmin ? 'System Governance' : isDoctor ? 'My Practice & Appointments' : 'My Appointments & Portal'}</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '4px',
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
  );
}
