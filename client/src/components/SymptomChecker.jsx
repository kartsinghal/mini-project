import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight, Loader2, FlaskConical } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { analyzeSymptoms, saveHistory } from '../services/api';
import toast from 'react-hot-toast';

const SYMPTOM_SUGGESTIONS = [
  'fever','headache','cough','sore throat','fatigue','nausea',
  'dizziness','chest pain','back pain','rash','shortness of breath',
  'stomach pain','anxiety','joint pain','runny nose',
];

// Token-tag input: add symptoms as removable pills
export default function SymptomChecker({ onResults }) {
  const { isDark } = useTheme();
  const { token, isLoggedIn } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const suggestions = SYMPTOM_SUGGESTIONS.filter(
    (s) => !tokens.includes(s) && s.includes(draft.toLowerCase().trim())
  ).slice(0, 6);

  const addToken = (val) => {
    const v = val.trim().toLowerCase();
    if (v && !tokens.includes(v) && tokens.length < 8) {
      setTokens((p) => [...p, v]);
    }
    setDraft('');
    inputRef.current?.focus();
  };

  const removeToken = (t) => setTokens((p) => p.filter((x) => x !== t));

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && draft.trim()) {
      e.preventDefault();
      addToken(draft);
    }
    if (e.key === 'Backspace' && !draft && tokens.length) {
      setTokens((p) => p.slice(0, -1));
    }
  };

  const submit = async () => {
    if (tokens.length === 0 && !draft.trim()) {
      toast.error('Add at least one symptom.');
      return;
    }
    const all = draft.trim() ? [...tokens, draft.trim()] : tokens;
    setDraft('');
    setTokens(all);
    setLoading(true);
    try {
      // Analyze with brief artificial delay
      await new Promise(r => setTimeout(r, 1200));
      const result = await analyzeSymptoms(all);
      onResults(result);

      if (isLoggedIn && token) {
        try {
          await saveHistory({
            symptoms: result.data.input,
            severity: result.overallSeverity || 'mild',
            healthScore: result.healthScore !== undefined ? result.healthScore : 100,
            category: result.category || 'Safe',
            aiAdvice: result.data.matches?.[0]?.basic_advice || 'Analysis marked complete.',
          }, token);
        } catch(e) { console.error('History save failed', e) }
      }

      setTimeout(() => {
        document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Server error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const severityColor = { mild: '#22c55e', moderate: '#f59e0b', critical: '#ef4444' };

  // bg / border
  const containerBg = isDark ? 'var(--dark-800)' : '#fff';
  const containerBorder = isDark
    ? focused ? 'var(--teal-bright)' : 'var(--dark-border)'
    : focused ? 'var(--teal)' : 'var(--light-border)';

  return (
    <section
      id="checker"
      style={{
        background: isDark ? 'var(--dark-900)' : 'var(--light-base)',
        padding: '100px var(--section-px)',
      }}
    >
      <div style={{ maxWidth: 860, marginLeft: 0 }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48 }}
        >
          <span className="text-sm uppercase tracking-widest block mb-3 font-semibold" style={{ color: 'var(--teal-bright)' }}>
            Symptom Checker
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}
          >
            What are you<br />experiencing?
          </h2>
          <p className="body-sm" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', maxWidth: 500 }}>
            Type symptoms and press Enter, or pick from suggestions. Be as specific as you like — "tight chest", "throbbing headache", etc.
          </p>
        </motion.div>

        {/* Token input box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Outer wrapper */}
          <div
            onClick={() => inputRef.current?.focus()}
            style={{
              background: containerBg,
              border: `1.5px solid ${containerBorder}`,
              borderRadius: 16,
              padding: '14px 16px',
              cursor: 'text',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: focused && isDark ? '0 0 0 3px rgba(20,184,166,0.12)' : focused ? '0 0 0 3px rgba(15,118,110,0.1)' : 'none',
              minHeight: 120,
              position: 'relative',
            }}
          >
            {/* Tokens + input row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <AnimatePresence>
                {tokens.map((t) => (
                  <motion.span
                    key={t}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 10px 5px 12px',
                      borderRadius: 99,
                      background: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(15,118,110,0.08)',
                      border: '1px solid rgba(20,184,166,0.25)',
                      fontSize: 13, fontWeight: 500,
                      color: isDark ? 'var(--teal-bright)' : 'var(--teal)',
                    }}
                  >
                    {t}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeToken(t); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 16, height: 16, borderRadius: '50%',
                        color: isDark ? 'rgba(20,184,166,0.7)' : 'var(--teal)',
                        opacity: 0.7,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Actual input */}
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder={tokens.length === 0 ? "e.g. fever, headache, sore throat..." : "Add another..."}
                style={{
                  flex: 1, minWidth: 160, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 14, fontWeight: 400,
                  color: isDark ? 'rgba(255,255,255,0.85)' : 'var(--light-text)',
                  padding: '4px 0',
                }}
              />
            </div>

            {/* Helper text */}
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.22)' : '#b0aca6', fontWeight: 400,
              }}>
                Press <kbd style={{
                  padding: '1px 5px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--light-100)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--light-border)',
                  fontSize: 11, fontFamily: 'monospace',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)',
                }}>Enter</kbd> or <kbd style={{
                  padding: '1px 5px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : 'var(--light-100)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--light-border)',
                  fontSize: 11, fontFamily: 'monospace',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)',
                }}>,</kbd> to add · up to 8 symptoms
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.18)' : '#c7c4be' }}>
                {tokens.length}/8
              </span>
            </div>
          </div>

          {/* Suggestions row */}
          {(focused || draft) && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.25)' : '#b0aca6', alignSelf: 'center', marginRight: 4 }}>
                Suggestions:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={(e) => { e.preventDefault(); addToken(s); }}
                  style={{
                    padding: '4px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 500,
                    border: isDark ? '1px solid var(--dark-border)' : '1px solid var(--light-border)',
                    background: isDark ? 'var(--dark-700)' : '#fff',
                    color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--light-muted)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--teal-bright)'; e.currentTarget.style.color = 'var(--teal-bright)'; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? 'var(--dark-border)' : 'var(--light-border)';
                    e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.55)' : 'var(--light-muted)';
                  }}
                >
                  + {s}
                </button>
              ))}
            </motion.div>
          )}

          {/* Submit row */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <motion.button
              onClick={submit}
              disabled={loading}
              className="btn-primary"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: 14, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
            >
              {loading ? (
                <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing symptoms...</>
              ) : (
                <><FlaskConical size={15} /> Analyze symptoms</>
              )}
            </motion.button>

            {tokens.length > 0 && (
              <button
                onClick={() => { setTokens([]); setDraft(''); onResults(null); }}
                style={{
                  fontSize: 13, fontWeight: 500, background: 'none', border: 'none',
                  cursor: 'pointer', color: isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)',
                  padding: '4px 0',
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
