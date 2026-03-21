import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const COLS = {
  Platform: ['Symptom Checker', 'First Aid Guide', 'AI Advisor', 'Dark & Light Mode'],
  Info: ['Awareness Only', 'No Data Stored', 'Open Source Dataset', 'Disclaimer'],
  Emergency: ['India: 112', 'Ambulance: 108', 'US / Canada: 911', 'UK: 999'],
};

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer style={{
      background: 'var(--dark-900)',
      borderTop: '1px solid var(--dark-border)',
      padding: '72px 24px 40px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'var(--teal)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>H</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
                HealthLens<span style={{ color: 'var(--teal-bright)' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, maxWidth: 240, marginBottom: 20 }}>
              Symptom-based health awareness. Built to inform, not diagnose.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 99,
              background: 'rgba(15,118,110,0.15)',
              border: '1px solid rgba(20,184,166,0.2)',
              fontSize: 12, color: 'var(--teal-bright)', fontWeight: 500,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} className="pulse-dot" />
              All systems operational
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([title, items]) => (
            <div key={title}>
              <h4 className="label" style={{ color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>{title}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => (
                  <li key={item}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', cursor: 'default', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                    >{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--dark-border)',
          paddingTop: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
            © 2025 HealthLens · For health awareness & education
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>
            Built with
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <Heart size={12} style={{ color: '#ef4444', fill: '#ef4444' }} />
            </motion.span>
            for better health awareness
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 720px) {
          footer [style*="grid-template-columns: 2fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 460px) {
          footer [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
