import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight, Loader2, FlaskConical, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { analyzeSymptoms, saveHistory } from '../services/api';
import toast from 'react-hot-toast';

const SYMPTOM_SUGGESTIONS = [
  'fever','headache','cough','sore throat','fatigue','nausea',
  'dizziness','chest pain','back pain','rash','shortness of breath',
  'stomach pain','anxiety','joint pain','runny nose',
];

export default function SymptomChecker({ onResults }) {
  const { isDark } = useTheme();
  const { token, isLoggedIn } = useAuth();
  const [tokens, setTokens] = useState([]);
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Show top suggestions matching draft, keep selected ones for visual toggle feedback
  const suggestions = SYMPTOM_SUGGESTIONS.filter(
    (s) => s.includes(draft.toLowerCase().trim())
  ).slice(0, 8);

  const addToken = (val) => {
    const v = val.trim().toLowerCase();
    if (v && !tokens.includes(v) && tokens.length < 8) {
      setTokens((p) => [...p, v]);
    }
    setDraft('');
    inputRef.current?.focus();
  };

  const removeToken = (t) => setTokens((p) => p.filter((x) => x !== t));

  const toggleToken = (val) => {
    const v = val.trim().toLowerCase();
    if (tokens.includes(v)) {
      removeToken(v);
    } else {
      addToken(v);
    }
  };

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

  // Dynamic input container active states
  const containerBg = isDark ? 'var(--dark-800)' : '#fff';
  const hasInput = tokens.length > 0;
  
  const glowAlpha = hasInput ? '0.25' : '0.12';
  const lightGlowAlpha = hasInput ? '0.2' : '0.08';
  
  const containerBorder = isDark
    ? focused ? 'var(--teal-bright)' : (hasInput ? 'rgba(20,184,166,0.5)' : 'var(--dark-border)')
    : focused ? 'var(--teal)' : (hasInput ? 'rgba(15,118,110,0.3)' : 'var(--light-border)');

  const activeBoxShadow = isDark 
    ? `0 0 0 ${hasInput ? 4 : 3}px rgba(20,184,166,${glowAlpha})` 
    : `0 0 0 ${hasInput ? 4 : 3}px rgba(15,118,110,${lightGlowAlpha})`;

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
            Tell us what's wrong
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}
          >
            How are you<br />feeling today?
          </h2>
          <p className="body-sm" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', maxWidth: 500 }}>
            Type how you feel and press Enter, or pick one from the list below. Be as specific as you want!
          </p>
        </motion.div>

        {/* Token input box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Outer input wrapper */}
          <motion.div
            layout
            onClick={() => inputRef.current?.focus()}
            style={{
              background: containerBg,
              border: `1.5px solid ${containerBorder}`,
              borderRadius: 16,
              padding: '16px 20px',
              cursor: 'text',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: focused ? activeBoxShadow : (hasInput ? `0 8px 30px ${isDark ? 'rgba(20,184,166,0.06)' : 'rgba(15,118,110,0.04)'}` : 'none'),
              minHeight: 120,
              position: 'relative',
            }}
          >
            {/* Tokens + input row */}
            <motion.div layout style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <AnimatePresence mode="popLayout">
                {tokens.map((t) => (
                  <motion.span
                    layout
                    key={t}
                    initial={{ scale: 0.8, opacity: 0, y: 5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px 6px 14px',
                      borderRadius: 99,
                      background: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(15,118,110,0.08)',
                      border: '1px solid rgba(20,184,166,0.25)',
                      fontSize: 13.5, fontWeight: 500,
                      color: isDark ? 'var(--teal-bright)' : 'var(--teal)',
                    }}
                  >
                    {t}
                    <motion.button
                      whileHover={{ scale: 1.15, backgroundColor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(15,118,110,0.15)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); removeToken(t); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 18, height: 18, borderRadius: '50%',
                        color: isDark ? 'rgba(20,184,166,0.8)' : 'var(--teal)',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <X size={12} />
                    </motion.button>
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
                placeholder={tokens.length === 0 ? "e.g. fever, headache, sore throat..." : "Add more symptoms..."}
                style={{
                  flex: 1, minWidth: 160, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: 14.5, fontWeight: 400,
                  color: isDark ? 'rgba(255,255,255,0.9)' : 'var(--light-text)',
                  padding: '6px 0',
                }}
              />
            </motion.div>

            {/* Helper text */}
            <motion.div layout style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11.5, color: isDark ? 'rgba(255,255,255,0.28)' : '#9ca3af', fontWeight: 500,
              }}>
                Press <kbd style={{
                  padding: '2px 6px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--light-100)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--light-border)',
                  fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)',
                }}>Enter</kbd> or <kbd style={{
                  padding: '2px 6px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--light-100)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--light-border)',
                  fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)',
                }}>,</kbd> to add
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: tokens.length === 8 ? 'var(--coral)' : (isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db') }}>
                {tokens.length}/8
              </span>
            </motion.div>
          </motion.div>

          {/* Suggestions row with active feedback */}
          <AnimatePresence>
            {(focused || draft) && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, overflow: 'hidden' }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', alignSelf: 'center', marginRight: 4 }}>
                  Suggestions
                </span>
                {suggestions.map((s) => {
                  const isSelected = tokens.includes(s);
                  return (
                    <motion.button
                      layout
                      key={s}
                      onMouseDown={(e) => { e.preventDefault(); toggleToken(s); }}
                      style={{
                        padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                        border: isSelected 
                          ? `1px solid ${isDark ? 'rgba(20,184,166,0.4)' : 'rgba(15,118,110,0.3)'}` 
                          : `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                        background: isSelected 
                          ? (isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,118,110,0.06)') 
                          : (isDark ? 'var(--dark-700)' : '#fff'),
                        color: isSelected 
                          ? (isDark ? 'var(--teal-bright)' : 'var(--teal)') 
                          : (isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)'),
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        borderColor: isSelected ? undefined : 'var(--teal-bright)',
                        color: isSelected ? undefined : (isDark ? '#fff' : 'var(--teal)')
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSelected ? <Check size={12} strokeWidth={3} /> : '+'} <span style={{ marginTop: 1 }}>{s}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic AI Insight Preview */}
          <AnimatePresence>
            {tokens.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '16px 20px', borderRadius: 16,
                  background: isDark ? 'rgba(20,184,166,0.06)' : 'rgba(15,118,110,0.03)',
                  border: `1px solid ${isDark ? 'rgba(20,184,166,0.15)' : 'rgba(15,118,110,0.1)'}`,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: 6, borderRadius: 10, background: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(15,118,110,0.1)' }}>
                  <Sparkles size={16} style={{ color: isDark ? 'var(--teal-bright)' : 'var(--teal)' }} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: 13.5, color: isDark ? '#fff' : 'var(--light-text)', marginBottom: 2 }}>
                    Ready for AI Analysis
                  </strong>
                  <span style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)', lineHeight: 1.5 }}>
                    Our intelligence engine will cross-reference your <strong>{tokens.length} symptom{tokens.length === 1 ? '' : 's'}</strong> against medical databases to provide immediate care insights and possible matches.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: tokens.length > 0 ? 0 : 8 }}>
            <motion.button
              onClick={submit}
              disabled={loading}
              className="btn-primary"
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: isDark ? '0 0 20px rgba(20,184,166,0.3)' : '0 8px 25px rgba(20,184,166,0.2)' }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: 14.5, padding: '14px 28px', opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer', fontWeight: 600 }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing Insights...</>
              ) : (
                <><FlaskConical size={16} /> Analyze my symptoms</>
              )}
            </motion.button>

            <AnimatePresence>
              {tokens.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => { setTokens([]); setDraft(''); onResults(null); }}
                  whileHover={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--light-100)' }}
                  style={{
                    fontSize: 13.5, fontWeight: 600, background: 'transparent',
                    border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                    borderRadius: 99, padding: '10px 20px',
                    cursor: 'pointer', color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--light-muted)',
                    transition: 'color 0.2s, background 0.2s'
                  }}
                >
                  Start over
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
