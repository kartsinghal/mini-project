import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Phone } from 'lucide-react';

/**
 * Sticky pulsing red banner shown when any critical symptom is detected.
 * Mounted in App.jsx, rendered above everything else.
 */
export default function SeverityAlertBanner({ results }) {
  const [dismissed, setDismissed] = useState(false);

  const hasCritical = results?.data?.matches?.some((m) => m.severity === 'critical');

  if (!hasCritical || dismissed) return null;

  const criticalMatches = results.data.matches
    .filter((m) => m.severity === 'critical')
    .map((m) => m.symptom_name);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)',
          borderBottom: '1px solid rgba(239,68,68,0.5)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Animated pulse ring background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.2) 0%, transparent 70%)',
            animation: 'pulse-ring 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(239,68,68,0.3)',
            border: '1px solid rgba(239,68,68,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            animation: 'pulse-dot 1.5s ease-in-out infinite',
          }}>
            <AlertTriangle size={16} color="#fca5a5" />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              fontWeight: 700, fontSize: 13.5, color: '#fca5a5',
              letterSpacing: '-0.01em',
            }}>
              ⚠ Critical Symptoms Detected — Seek Immediate Medical Attention
            </span>
            <span style={{
              display: 'block', fontSize: 11.5, color: 'rgba(252,165,165,0.7)',
              marginTop: 1,
            }}>
              {criticalMatches.map((s) => (
                <span key={s} style={{
                  display: 'inline-block',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 99, padding: '0px 7px',
                  marginRight: 5, textTransform: 'capitalize',
                }}>{s}</span>
              ))}
              may require emergency care.
            </span>
          </div>

          {/* Call button */}
          <a
            href="tel:112"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: '#ef4444', color: '#fff',
              fontSize: 12, fontWeight: 700,
              textDecoration: 'none', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.2)',
              letterSpacing: '0.02em',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ef4444'; }}
          >
            <Phone size={12} />
            Call 112
          </a>

          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              color: 'rgba(252,165,165,0.7)',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(252,165,165,0.7)'; }}
            title="Dismiss alert"
          >
            <X size={13} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
