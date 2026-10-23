import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Building2,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot Password Flow State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Request Code, 2: Reset Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();

  // If already authenticated as admin, automatically route to admin portal
  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/portal', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Handle Admin Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();
      const res = await login(cleanEmail, cleanPass);
      if (res && res.user && res.user.role === 'admin') {
        window.location.href = '/admin/portal';
      } else {
        // If a non-admin attempts to log in via admin panel
        logout();
        setError('Access Denied: This console is strictly reserved for System Administrators. Patient and Doctor accounts should use standard sign-in.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 1: Request Password Reset Code
  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await authAPI.forgotPassword({ email: forgotEmail.trim().toLowerCase() });
      if (res.success) {
        setForgotSuccess(res.message || 'Reset instructions and verification code generated.');
        if (res.resetCode) {
          setResetCode(res.resetCode);
        }
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.message || 'Could not verify admin email. Please check and try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Step 2: Confirm New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      setForgotLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      setForgotLoading(false);
      return;
    }

    try {
      const res = await authAPI.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        resetCode: resetCode.trim(),
        newPassword: newPassword,
      });

      if (res.success) {
        setSuccessMsg('Admin password updated successfully! Please sign in with your new password.');
        setPassword(newPassword);
        setEmail(forgotEmail);
        setIsForgotMode(false);
        setForgotStep(1);
        setNewPassword('');
        setConfirmPassword('');
        setResetCode('');
      }
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please check your verification code.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)',
        padding: '50px 20px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '450px',
          height: '450px',
          background: 'rgba(37, 99, 235, 0.15)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '450px',
          height: '450px',
          background: 'rgba(13, 148, 136, 0.15)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10 }}>
        
        {/* Return to Home Link */}
        <div style={{ marginBottom: '18px', textAlign: 'left' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <ChevronLeft size={16} />
            <span>Return to Public Healthcare Portal</span>
          </Link>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(37, 99, 235, 0.2)',
            color: '#f8fafc',
          }}
        >
          {/* Header Brand */}
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.45)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Shield size={32} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#60a5fa',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              <ShieldCheck size={13} />
              Hospital System Governance
            </div>

            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
              }}
            >
              {isForgotMode ? 'Admin Password Recovery' : 'Admin Panel Sign In'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
              {isForgotMode
                ? 'Reset your administrative security credentials with instant verification'
                : 'Manage Delhi NCR medical hubs, doctor verification rosters & appointments'}
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                color: '#34d399',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* VIEW 1: REGULAR ADMIN LOGIN FORM */}
          {!isForgotMode && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  Admin Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@hospital.com"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 38px',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                  />
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#cbd5e1',
                      margin: 0,
                    }}
                  >
                    Admin Master Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotEmail(email);
                      setError('');
                      setSuccessMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#60a5fa',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 38px 12px 38px',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                  />
                  <Lock
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                    }}
                  />
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
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px',
                  fontSize: '0.76rem',
                  color: '#94a3b8',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} style={{ color: '#10b981' }} />
                  <span>Verified 256-Bit SSL Root Access</span>
                </div>
                <span>Port 5001 • Encrypted</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Panel</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 2: FORGOT PASSWORD WORKFLOW */}
          {isForgotMode && (
            <div>
              {forgotError && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '8px',
                    color: '#34d399',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '16px',
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* Forgot Step 1: Request Code */}
              {forgotStep === 1 && (
                <form onSubmit={handleRequestResetCode}>
                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '6px',
                      }}
                    >
                      Registered Admin Email *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@hospital.com"
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      <Mail
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                      color: '#ffffff',
                      fontSize: '0.94rem',
                      fontWeight: 700,
                      cursor: forgotLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)',
                    }}
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Sending Instructions...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} />
                        <span>Generate Reset Code</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Forgot Step 2: Enter Code & New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPasswordSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '6px',
                      }}
                    >
                      Verification Code *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="e.g. 849201"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 38px',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          outline: 'none',
                        }}
                      />
                      <KeyRound
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '6px',
                      }}
                    >
                      New Admin Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 38px',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        marginBottom: '6px',
                      }}
                    >
                      Confirm New Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 38px',
                          background: 'rgba(15, 23, 42, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '0.92rem',
                          outline: 'none',
                        }}
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#64748b',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      fontSize: '0.94rem',
                      fontWeight: 700,
                      cursor: forgotLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    {forgotLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Save New Password & Return</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Back to regular login */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setForgotStep(1);
                    setForgotError('');
                    setForgotSuccess('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>Back to Admin Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
