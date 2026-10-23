import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Activity,
  AlertCircle,
  Shield,
  Stethoscope,
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        {/* Main Login Card */}
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
                <Link
                  to="/login"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  style={{ fontSize: '0.78rem', color: 'var(--primary-600)', textDecoration: 'none', fontWeight: 600 }}
                >
                  Forgot Password?
                </Link>
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
      </div>
    </div>
  );
}
