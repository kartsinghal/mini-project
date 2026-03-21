import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

// ⚠️ CRITICAL: Field must be defined OUTSIDE Login to prevent remount on every keystroke
function Field({ id, label, type, value, onChange, error, icon: Icon, onToggle, styles }) {
  const { text, muted, inputBg, inputBorder, teal } = styles;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: muted }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: error ? '#ef4444' : muted, pointerEvents: 'none',
        }}>
          <Icon size={15} />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={id}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 40px 11px 38px',
            borderRadius: 10,
            border: `1.5px solid ${error ? '#ef4444' : inputBorder}`,
            background: inputBg,
            color: text,
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(ev) => { ev.target.style.borderColor = error ? '#ef4444' : teal; }}
          onBlur={(ev) => { ev.target.style.borderColor = error ? '#ef4444' : inputBorder; }}
        />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 4,
            }}
          >
            {type === 'password' ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

export default function Login() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    setErrors((e) => ({ ...e, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);

    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/login`, form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark ? '#0b0f0e' : '#f6f5f3';
  const card = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#f1f5f9' : '#1a2420';
  const muted = isDark ? 'rgba(255,255,255,0.45)' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const teal = '#0FA77F';

  const fieldStyles = { text, muted, inputBg, inputBorder, teal };

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>H</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 20, color: text, letterSpacing: -0.5 }}>
              HealthLens<span style={{ color: teal }}>.</span>
            </span>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: card, border: `1px solid ${border}`,
          borderRadius: 20, padding: '36px 32px',
          boxShadow: isDark ? '0 0 40px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.07)',
        }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: text, letterSpacing: -0.5 }}>
            Welcome back
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 14, color: muted }}>
            Sign in to your HealthLens account
          </p>

          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 13, color: '#ef4444',
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
              }}
            >
              <AlertCircle size={14} /> {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              icon={Mail}
              styles={fieldStyles}
            />
            <Field
              id="password"
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              icon={Lock}
              onToggle={() => setShowPw((v) => !v)}
              styles={fieldStyles}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                background: loading ? 'rgba(15,167,127,0.7)' : teal,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '12px', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s, transform 0.1s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#0c9470'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = teal; }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: 24, fontSize: 13, color: muted, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: teal, fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
