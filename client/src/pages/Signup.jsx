import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

// ⚠️ CRITICAL: All sub-components MUST be defined OUTSIDE Signup to prevent remount on keystroke

function Field({ id, label, type, value, onChange, placeholder, error, icon: Icon, onToggle, styles }) {
  const { text, muted, inputBg, inputBorder, teal } = styles;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12.5, fontWeight: 600, color: muted, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: error ? '#ef4444' : muted, pointerEvents: 'none' }}>
          <Icon size={15} />
        </span>
        <input
          id={id} type={type} value={value} onChange={onChange}
          autoComplete={id} placeholder={placeholder || ''}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 40px 12px 40px',
            borderRadius: 10,
            border: `1.5px solid ${error ? '#ef4444' : inputBorder}`,
            background: inputBg, color: text,
            fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = error ? '#ef4444' : teal; }}
          onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : inputBorder; }}
        />
        {onToggle && (
          <button type="button" onClick={onToggle} tabIndex={-1}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 4 }}>
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

function AgeField({ value, onChange, error, styles }) {
  const { text, muted, inputBg, inputBorder, teal } = styles;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor="age" style={{ fontSize: 12.5, fontWeight: 600, color: muted, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Age</label>
      <input
        id="age" type="number" min="1" max="120"
        value={value} onChange={onChange} placeholder="e.g. 28"
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '12px 14px', borderRadius: 10,
          border: `1.5px solid ${error ? '#ef4444' : inputBorder}`,
          background: inputBg, color: text, fontSize: 14, outline: 'none',
          transition: 'border-color 0.2s', MozAppearance: 'textfield',
        }}
        onFocus={(e) => { e.target.style.borderColor = error ? '#ef4444' : teal; }}
        onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : inputBorder; }}
      />
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

const GENDERS = ['Male', 'Female', 'Other'];
function GenderPills({ value, onChange, styles }) {
  const { muted, inputBg, inputBorder, teal } = styles;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: muted, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Gender</span>
      <div style={{ display: 'flex', gap: 8 }}>
        {GENDERS.map((g) => {
          const active = value === g;
          return (
            <button key={g} type="button" onClick={() => onChange(g)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 99,
                border: `1.5px solid ${active ? teal : inputBorder}`,
                background: active ? `${teal}1a` : inputBg,
                color: active ? teal : muted,
                fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.18s ease', outline: 'none',
                boxShadow: active ? `0 0 0 3px ${teal}20` : 'none',
              }}>
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Phone field with +91 prefix — outside Signup to prevent remount
function PhoneField({ value, onChange, error, styles }) {
  const { text, muted, inputBg, inputBorder, teal } = styles;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor="phone" style={{ fontSize: 12.5, fontWeight: 600, color: muted, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Mobile Number</label>
      <div style={{ display: 'flex' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 12px', borderRadius: '10px 0 0 10px',
          border: `1.5px solid ${error ? '#ef4444' : inputBorder}`, borderRight: 'none',
          background: inputBg, color: muted, fontSize: 13.5, fontWeight: 600,
          whiteSpace: 'nowrap', userSelect: 'none', flexShrink: 0,
        }}>
          <Phone size={14} color={error ? '#ef4444' : muted} />
          <span>+91</span>
        </div>
        <input
          id="phone" type="tel" value={value} inputMode="numeric"
          placeholder="Enter mobile number"
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          style={{
            flex: 1, boxSizing: 'border-box', padding: '12px 14px',
            borderRadius: '0 10px 10px 0',
            border: `1.5px solid ${error ? '#ef4444' : inputBorder}`,
            background: inputBg, color: text, fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = error ? '#ef4444' : teal; }}
          onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : inputBorder; }}
        />
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  );
}

export default function Signup() {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', age: '', gender: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 2) e.name = 'At least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'At least 6 characters.';
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number.';
    if (form.age) {
      const n = Number(form.age);
      if (!Number.isInteger(n) || n < 1 || n > 120) e.age = 'Enter a valid age (1–120).';
    }
    return e;
  };

  const set = (field) => (ev) => {
    const val = typeof ev === 'string' ? ev : ev.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/signup`, form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const pw = form.password;
  const strength = pw.length === 0 ? 0 : pw.length < 6 ? 1 : pw.length < 10 ? 2 : 3;
  const strengthColor = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'];

  const bg       = isDark ? '#090d0c' : '#f4f3f1';
  const card     = isDark ? 'rgba(255,255,255,0.035)' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const text     = isDark ? '#f1f5f9' : '#1a2420';
  const muted    = isDark ? 'rgba(255,255,255,0.4)'  : '#6b7280';
  const inputBg  = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafb';
  const inputBorder = isDark ? 'rgba(255,255,255,0.09)' : '#e2e8f0';
  const teal     = '#0FA77F';

  const fieldStyles = { text, muted, inputBg, inputBorder, teal };

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>H</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 19, color: text, letterSpacing: -0.5 }}>
              HealthLens<span style={{ color: teal }}>.</span>
            </span>
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: card, border: `1px solid ${border}`,
          borderRadius: 18, padding: '32px 28px',
          boxShadow: isDark ? '0 0 48px rgba(0,0,0,0.45)' : '0 8px 40px rgba(0,0,0,0.06)',
        }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 21, fontWeight: 700, color: text, letterSpacing: -0.4 }}>
            Create your account
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 13.5, color: muted }}>
            Your health, guided by AI.
          </p>

          {serverError && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <AlertCircle size={13} /> {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Row 1: Name */}
            <Field id="name" label="Full name" type="text" placeholder="Enter your full name"
              value={form.name} onChange={set('name')} error={errors.name} icon={User} styles={fieldStyles} />

            {/* Row 2: Email */}
            <Field id="email" label="Email" type="email" placeholder="Enter your email"
              value={form.email} onChange={set('email')} error={errors.email} icon={Mail} styles={fieldStyles} />

            {/* Row 3: Mobile */}
            <PhoneField value={form.phone} onChange={set('phone')} error={errors.phone} styles={fieldStyles} />

            {/* Row 4: Age + Gender inline */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 12 }}>
              <AgeField value={form.age} onChange={set('age')} error={errors.age} styles={fieldStyles} />
              <GenderPills value={form.gender} onChange={set('gender')} styles={fieldStyles} />
            </div>

            {/* Row 4: Password + strength */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Field id="password" label="Password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} error={errors.password}
                icon={Lock} onToggle={() => setShowPw((v) => !v)} styles={fieldStyles} />
              {pw.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 2.5, borderRadius: 99, background: isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${(strength / 3) * 100}%` }}
                      style={{ height: '100%', background: strengthColor[strength], borderRadius: 99 }}
                      transition={{ duration: 0.3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor[strength], minWidth: 32 }}>
                    {strengthLabel[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                marginTop: 4, background: loading ? `${teal}99` : teal,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#0c9470'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = teal; }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ marginTop: 20, fontSize: 13, color: muted, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: teal, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 11.5, color: muted }}>
          Your data stays private. We never sell it.
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
