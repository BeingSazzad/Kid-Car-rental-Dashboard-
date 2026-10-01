import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Shield, Lock, Mail, Eye, EyeOff, CheckCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@home2school.ca');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('admin@home2school.ca');
  const [forgotStep, setForgotStep] = useState<'input' | 'success'>('input');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const ok = login(email, password);
      if (ok) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try admin@home2school.ca / admin123');
      }
    }, 400);
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotStep('success');
  };

  const autofillDemo = () => {
    setEmail('admin@home2school.ca');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1B2B68 50%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: '100%',
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Brand Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#1B2B68',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 8px 20px rgba(27, 43, 104, 0.3)',
            }}
          >
            <Shield size={28} color="#FFFFFF" />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Home2School
          </h1>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1B2B68', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
            Admin Console Portal
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 18,
              color: '#DC2626',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
              Admin Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, color: '#94A3B8' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@home2school.ca"
                style={{
                  width: '100%',
                  height: 42,
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  paddingLeft: 38,
                  paddingRight: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotStep('input');
                }}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1B2B68',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, color: '#94A3B8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  height: 42,
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  paddingLeft: 38,
                  paddingRight: 40,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ accentColor: '#1B2B68', cursor: 'pointer' }}
              />
              Remember session
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 44,
              borderRadius: 10,
              border: 'none',
              background: '#1B2B68',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 12px rgba(27, 43, 104, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: '0 0 8px' }}>
            Demo Super Admin Credentials:
          </p>
          <button
            type="button"
            onClick={autofillDemo}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              color: '#1B2B68',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Auto-Fill Demo Login
          </button>
        </div>
      </div>

      {/* ── Forgot / Reset Password Modal ── */}
      {forgotModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => setForgotModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              width: 400,
              maxWidth: '100%',
              padding: '28px 24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {forgotStep === 'input' ? (
              <form onSubmit={handleSendReset}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={20} color="#1B2B68" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Reset Password
                    </h2>
                    <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                      Enter your admin email to receive instructions
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new admin password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: 40,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: 14,
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#64748B',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 8,
                      border: 'none',
                      background: '#1B2B68',
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={44} color="#10B981" style={{ margin: '0 auto 12px' }} />
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  Password Updated!
                </h2>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Your password has been successfully reset. You can now log in with your updated credentials.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 8,
                    border: 'none',
                    background: '#1B2B68',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
