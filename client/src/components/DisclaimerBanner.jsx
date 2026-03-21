import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DisclaimerBanner() {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        background: isDark ? 'rgba(217,119,6,0.07)' : 'rgba(217,119,6,0.05)',
        borderTop: isDark ? '1px solid rgba(217,119,6,0.18)' : '1px solid rgba(217,119,6,0.15)',
        borderBottom: isDark ? '1px solid rgba(217,119,6,0.18)' : '1px solid rgba(217,119,6,0.15)',
        padding: '16px 24px',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <AlertTriangle size={15} style={{ color: 'var(--amber)', flexShrink: 0 }} />
        <p style={{
          flex: 1, fontSize: 12.5, lineHeight: 1.55, margin: 0,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)',
        }}>
          <strong style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--light-text)' }}>
            Medical Disclaimer:
          </strong>{' '}
          HealthLens is <strong>not</strong> a diagnostic tool. All content is for general health awareness only. Always consult a qualified healthcare professional. In emergencies: <strong>call 108 / 112 / 911</strong>.
        </p>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
          color: '#22c55e', flexShrink: 0,
        }}>
          <ShieldCheck size={12} />
          Awareness Only
        </span>
      </div>
    </motion.div>
  );
}
