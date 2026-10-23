import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Activity,
  AlertCircle,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function LoginPage() {
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Request code, 2 = Enter code & new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Standard Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessBanner('');

    try {
      const res = await login(email.trim().toLowerCase(), password);
      if (res.user.role === 'admin') navigate('/admin/portal');
      else if (res.user.role === 'doctor') navigate('/doctor/portal');
      else navigate('/patient/portal');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send Verification Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      const res = await authAPI.forgotPassword({ email: forgotEmail.trim().toLowerCase() });
      if (res.success) {
        setForgotSuccess(res.message || 'A 6-digit verification code has been sent to your email. Please check your inbox.');
        setResetCode(''); // Code is sent to email only, never displayed or pre-filled on screen
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.message || 'No user registered with this email address.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Reset Password with Code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!resetCode.trim()) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await authAPI.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        resetCode: resetCode.trim(),
        newPassword: newPassword,
      });

      if (res.success) {
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        // Pre-fill login credentials with updated password
        setEmail(forgotEmail.trim().toLowerCase());
        setPassword(newPassword);
        setSuccessBanner('Password reset successfully! You can now sign in with your new password.');

        // Reset forgot state & return to sign in
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
        background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fafc 100%)',
        padding: '50px 20px 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Main Card */}
        <div
          className="glass-card"
          style={{
            padding: '36px',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)',
            background: '#ffffff',
            border: '1px solid var(--slate-200)',
          }}
        >
          {!isForgotMode ? (
            /* ============================================== */
            /* 1. SIGN IN VIEW                               */
            /* ============================================== */
            <div>
              {/* Brand Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    boxShadow: '0 6px 14px rgba(13, 148, 136, 0.3)',
                  }}
                >
                  <Activity size={26} />
                </div>
                <h2 style={{ fontSize: '1.65rem', color: 'var(--slate-900)', fontWeight: 800 }}>
                  Sign In to CARE CONNECT
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  Access your appointments, medical records & doctor schedules
                </p>
              </div>

              {/* Password Reset Success Banner */}
              {successBanner && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#ecfdf5',
                    color: '#065f46',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>{successBanner}</span>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'var(--danger-bg)',
                    color: '#b91c1c',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: '38px' }}
                    />
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--slate-400)',
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Password *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setForgotStep(1);
                        setForgotEmail(email || '');
                        setForgotError('');
                        setForgotSuccess('');
                        setSuccessBanner('');
                      }}
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--primary-600)',
                        background: 'transparent',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingLeft: '38px', paddingRight: '38px' }}
                    />
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--slate-400)',
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
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--slate-600)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px' }}
                    />
                    <span>Remember this device</span>
                  </label>

                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--primary-600)' }} />
                    <span>256-bit SSL</span>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Register Prompt */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--slate-100)',
                  textAlign: 'center',
                  fontSize: '0.88rem',
                  color: 'var(--slate-600)',
                }}
              >
                Don't have an account yet?
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                  <Link
                    to="/register"
                    style={{
                      color: 'var(--primary-600)',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    Register as Patient →
                  </Link>
                  <span style={{ color: 'var(--slate-300)' }}>|</span>
                  <Link
                    to="/register?role=doctor"
                    style={{
                      color: 'var(--sapphire-600)',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    Join as Doctor →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================== */
            /* 2. FORGOT / RESET PASSWORD VIEW               */
            /* ============================================== */
            <div>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    boxShadow: '0 6px 14px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <KeyRound size={26} />
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-900)', fontWeight: 800 }}>
                  Reset Your Password
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  {forgotStep === 1
                    ? 'Enter your registered email to receive a 6-digit verification code'
                    : 'Enter the verification code and choose a new password'}
                </p>
              </div>

              {/* Error Banner */}
              {forgotError && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'var(--danger-bg)',
                    color: '#b91c1c',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '18px',
                    border: '1px solid #fecaca',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* Success Banner */}
              {forgotSuccess && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#f0fdf4',
                    color: '#15803d',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '18px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* Step 1: Request Code Form */}
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestCode}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Registered Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. patient@hospital.com or doctor@hospital.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        style={{ paddingLeft: '38px' }}
                      />
                      <Mail
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--slate-400)',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {forgotLoading ? (
                      <span>Generating Code...</span>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '18px' }}>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-600)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Set New Password Form */
                <form onSubmit={handleResetPassword}>
                  <div
                    style={{
                      background: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      color: 'var(--slate-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <span>Account: <strong>{forgotEmail}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setForgotSuccess('');
                        setForgotError('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-600)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Change
                    </button>
                  </div>

                  {/* Verification Code Input */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">6-Digit Verification Code *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter 6-digit code from email"
                        maxLength="6"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        autoFocus
                        style={{ paddingLeft: '38px', letterSpacing: '4px', fontWeight: 700, fontSize: '1rem' }}
                      />
                      <Shield
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--slate-400)',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '4px', display: 'block' }}>
                      Check your email inbox (and spam folder) for the 6-digit verification code.
                    </span>
                  </div>

                  {/* New Password Input */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">New Password (Min 6 Characters) *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--slate-400)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--slate-400)',
                          cursor: 'pointer',
                        }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Input */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Confirm New Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      />
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--slate-400)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--slate-400)',
                          cursor: 'pointer',
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <span style={{ fontSize: '0.74rem', color: '#dc2626', marginTop: '4px', display: 'block' }}>
                        Passwords do not match
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {forgotLoading ? (
                      <span>Resetting Password...</span>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>Reset & Save New Password</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => handleRequestCode({ preventDefault: () => {} })}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-600)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Resend Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-500)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel & Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
