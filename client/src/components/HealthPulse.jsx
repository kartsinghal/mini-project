import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Activity } from 'lucide-react';
import { useScrollPause } from '../hooks/useScrollPause';

// Animated radial arc segments representing a health severity gauge
const WEDGES = [
  { label: 'Mild', pct: 40, color: '#22c55e', description: 'Manageable at home' },
  { label: 'Moderate', pct: 30, color: '#f59e0b', description: 'Monitor closely' },
  { label: 'Severe', pct: 20, color: '#f97316', description: 'See a doctor soon' },
  { label: 'Critical', pct: 10, color: '#ef4444', description: 'Emergency care needed' },
];

// Draws an SVG arc from start to end angle
function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ArcSegment({ cx, cy, r, startAngle, endAngle, color, thickness }) {
  const o = polarToXY(cx, cy, r, startAngle);
  const e = polarToXY(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const d = `M ${o.x} ${o.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export default function HealthPulse() {
  const { isDark } = useTheme();
  const isScrolling = useScrollPause();
  const [activeIdx, setActiveIdx] = useState(0);
  const controls = useAnimation();

  // Rotate through wedges
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((p) => (p + 1) % WEDGES.length), 2800);
    return () => clearInterval(t);
  }, []);

  // Build arc data: 220° total arc, starting at -110°
  const TOTAL_ARC = 220;
  const START_ANG = -110;
  const GAP = 4;
  const CX = 100, CY = 100, R = 70, THICKNESS = 14;

  let cursor = START_ANG;
  const arcs = WEDGES.map((w) => {
    const span = (w.pct / 100) * TOTAL_ARC;
    const s = cursor + GAP / 2;
    const e = cursor + span - GAP / 2;
    cursor += span;
    return { ...w, s, e };
  });

  const active = WEDGES[activeIdx];

  return (
    <section
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, var(--dark-900), var(--dark-800))'
          : 'linear-gradient(to bottom, var(--light-base), var(--light-100))',
        padding: '72px var(--section-px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Asymmetric layout: meter left (40%), info right (60%) — unusual split */}
      <div style={{
        maxWidth: 1280,
        marginLeft: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: 0,
        alignItems: 'center',
      }}>

        {/* ── Left: Radial meter ────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

          {/* SVG Gauge */}
          <div style={{ position: 'relative', width: 220, height: 200, flexShrink: 0 }}>
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Background track */}
              <path
                d={`M ${polarToXY(100, 100, 70, START_ANG).x} ${polarToXY(100, 100, 70, START_ANG).y}
                    A 70 70 0 1 1 ${polarToXY(100, 100, 70, START_ANG + TOTAL_ARC).x} ${polarToXY(100, 100, 70, START_ANG + TOTAL_ARC).y}`}
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                strokeWidth={14}
                strokeLinecap="round"
              />

              {/* Colored arcs */}
              {arcs.map((arc, i) => (
                <ArcSegment
                  key={arc.label}
                  cx={CX} cy={CY} r={R}
                  startAngle={arc.s} endAngle={arc.e}
                  color={arc.color}
                  thickness={i === activeIdx ? 18 : THICKNESS}
                />
              ))}

              {/* Center indicator dot */}
              <motion.circle
                cx={100} cy={100} r={6}
                fill={active.color}
                animate={isScrolling ? {} : { scale: [1, 1.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 6px ${active.color})`, willChange: 'transform', transform: 'translateZ(0)' }}
              />
            </svg>

            {/* Center text overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              marginTop: -12,
            }}>
              <motion.span
                key={active.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: active.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {active.label}
              </motion.span>
              <motion.span
                key={active.pct}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontSize: 28, fontWeight: 800,
                  color: isDark ? '#fff' : 'var(--light-text)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.04em',
                }}
              >
                {active.pct}%
              </motion.span>
              <span style={{ fontSize: 10, color: isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)', marginTop: 2 }}>of cases</span>
            </div>
          </div>

          {/* Horizontal pulse bar below gauge */}
          <div style={{ width: '80%', marginTop: 10, position: 'relative' }}>
            <div style={{ height: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <motion.div
                animate={isScrolling ? {} : { x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
                style={{ height: '100%', width: '50%', background: `linear-gradient(90deg, transparent, ${active.color}, transparent)`, borderRadius: 99, willChange: 'transform', transform: 'translateZ(0)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Right: Legend + explanation ───────────────────── */}
        <div style={{ paddingLeft: 40, borderLeft: isDark ? '1px solid var(--dark-border)' : '1px solid var(--light-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={14} style={{ color: 'var(--teal-bright)' }} />
            </div>
            <span className="label" style={{ color: 'var(--teal-bright)' }}>Symptom Severity Scale</span>
          </div>

          <h2
            className="display-md"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              marginBottom: 10,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.03em',
              fontSize: 'clamp(1.2rem, 2.2vw, 1.7rem)',
            }}
          >
            Not all symptoms are<br />equal in urgency.
          </h2>
          <p className="body-sm" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', marginBottom: 28, maxWidth: 380 }}>
            Understanding severity helps you decide between home care, scheduling a doctor's visit, or calling emergency services.
          </p>

          {/* Legend list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WEDGES.map((w, i) => (
              <motion.div
                key={w.label}
                onClick={() => setActiveIdx(i)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10,
                  cursor: 'pointer',
                  background: i === activeIdx
                    ? isDark ? `${w.color}15` : `${w.color}10`
                    : 'transparent',
                  border: `1px solid ${i === activeIdx ? w.color + '35' : 'transparent'}`,
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {/* Color bar */}
                <div style={{ width: 3, height: 36, borderRadius: 99, background: w.color, flexShrink: 0, opacity: i === activeIdx ? 1 : 0.35 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 13.5, fontWeight: 600,
                      color: i === activeIdx ? w.color : isDark ? 'rgba(255,255,255,0.55)' : 'var(--light-muted)',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {w.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: w.color, opacity: i === activeIdx ? 1 : 0.4 }}>
                      {w.pct}%
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)', lineHeight: 1.4 }}>
                    {w.description}
                  </span>
                </div>
                {/* Progress dot */}
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: i === activeIdx ? w.color : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  boxShadow: i === activeIdx ? `0 0 8px ${w.color}` : 'none',
                }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 700px) {
          #healthpulse > div { grid-template-columns: 1fr !important; }
          #healthpulse > div > div:last-child { padding-left: 0 !important; border-left: none !important; padding-top: 28px; border-top: 1px solid var(--dark-border); }
        }
      `}</style>
    </section>
  );
}
