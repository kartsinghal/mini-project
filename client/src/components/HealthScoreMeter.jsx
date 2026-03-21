import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Calculates a health score (0–100) from analysis results.
 * Starts at 100, deducts based on severity of each match.
 */
function computeScore(results) {
  if (!results?.data?.matches?.length) return 82; // default healthy
  const deductions = { mild: 10, moderate: 22, critical: 40 };
  const total = results.data.matches.reduce(
    (acc, m) => acc + (deductions[m.severity] ?? 10),
    0
  );
  return Math.max(8, 100 - total);
}

function getScoreConfig(score) {
  if (score >= 70) return { label: 'Good', color: '#22c55e', glow: 'rgba(34,197,94,0.3)', track: 'rgba(34,197,94,0.12)' };
  if (score >= 40) return { label: 'Fair', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', track: 'rgba(245,158,11,0.12)' };
  return { label: 'Poor', color: '#ef4444', glow: 'rgba(239,68,68,0.3)', track: 'rgba(239,68,68,0.12)' };
}

// SVG Arc parameters
const R = 72;
const STROKE = 10;
const CX = 90;
const CY = 90;
const FULL_ARC = Math.PI * R; // half-circle arc length

function describeArc(score) {
  const pct = score / 100;
  const arcLen = pct * FULL_ARC;
  return arcLen;
}

export default function HealthScoreMeter({ results }) {
  const { isDark } = useTheme();
  const score = computeScore(results);
  const cfg = getScoreConfig(score);

  const [displayScore, setDisplayScore] = useState(0);
  const [arcLen, setArcLen] = useState(0);

  // Count-up animation
  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1200;
    const targetScore = score;
    const targetArc = describeArc(score);

    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * targetScore));
      setArcLen(eased * targetArc);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const panelBg = isDark ? 'var(--dark-800)' : '#fff';
  const panelBorder = isDark ? 'var(--dark-border)' : 'var(--light-border)';
  const trackColor = isDark ? 'rgba(255,255,255,0.05)' : '#f0efec';

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: isDark ? 'var(--dark-900)' : 'var(--light-base)',
        padding: '0 0 80px',
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        {/* Section label */}
        <div style={{ marginBottom: 28 }}>
          <span className="label" style={{ color: 'var(--teal-bright)', display: 'block', marginBottom: 8 }}>
            Health Assessment
          </span>
          <h2
            className="display-md"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              fontFamily: "'Poppins', system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Overall Health Score
          </h2>
        </div>

        {/* Meter card */}
        <motion.div
          style={{
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            borderRadius: 24,
            padding: '40px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            flexWrap: 'wrap',
            boxShadow: `0 0 0 1px ${cfg.track}, 0 8px 40px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'}`,
          }}
          whileHover={{ boxShadow: `0 0 0 1px ${cfg.glow}, 0 12px 48px ${cfg.track}` }}
          transition={{ duration: 0.3 }}
        >
          {/* SVG Gauge */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={180} height={100} viewBox="0 0 180 100">
              {/* Track arc */}
              <path
                d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                fill="none"
                stroke={trackColor}
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
              {/* Score arc */}
              <path
                d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
                fill="none"
                stroke={cfg.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${arcLen} ${FULL_ARC}`}
                style={{ filter: `drop-shadow(0 0 6px ${cfg.glow})`, transition: 'none' }}
              />
            </svg>

            {/* Score number overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 0)',
              textAlign: 'center',
              lineHeight: 1,
            }}>
              <div style={{
                fontSize: 42,
                fontWeight: 800,
                color: cfg.color,
                fontFamily: "'Poppins', system-ui, sans-serif",
                letterSpacing: '-0.04em',
                filter: `drop-shadow(0 0 10px ${cfg.glow})`,
              }}>
                {displayScore}
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: cfg.color,
                marginTop: 2,
                opacity: 0.75,
              }}>
                / 100
              </div>
            </div>
          </div>

          {/* Right side info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {/* Status pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 14px',
              borderRadius: 99,
              background: `${cfg.track}`,
              border: `1px solid ${cfg.glow}`,
              marginBottom: 16,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: cfg.color,
                boxShadow: `0 0 6px ${cfg.color}`,
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, letterSpacing: '0.04em' }}>
                {cfg.label} Condition
              </span>
            </div>

            <p style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)',
              marginBottom: 20,
              margin: '0 0 20px',
            }}>
              Based on your reported symptoms and their severity levels, your estimated health score is
              {' '}<strong style={{ color: cfg.color }}>{score}</strong> out of 100.
            </p>

            {/* Score breakdown */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {results?.data?.matches?.map((m, i) => {
                const matchCfg = getScoreConfig(m.severity === 'mild' ? 80 : m.severity === 'moderate' ? 50 : 20);
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)',
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: matchCfg.color, flexShrink: 0,
                    }} />
                    <span style={{ textTransform: 'capitalize' }}>{m.symptom_name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: matchCfg.color,
                      background: matchCfg.track,
                      padding: '1px 6px', borderRadius: 99,
                      border: `1px solid ${matchCfg.glow}`,
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {m.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
