import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Shield, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useScrollPause } from '../hooks/useScrollPause';

/* ─── ECG line: static path + GPU-only traveling light sweep ─── */
function EcgLine({ paused }) {
  // The waveform path is completely static — no SVG path animation at all.
  // The pulse effect is a radial gradient rect that slides left→right
  // using CSS translateX only (compositor thread, zero paint cost).
  const PATH = "M0 30 L55 30 L70 30 L80 8 L90 54 L105 3 L120 58 L135 30 L155 30 L170 30 L180 18 L190 42 L200 22 L210 40 L220 30 L280 30 L320 30 L330 12 L342 48 L355 5 L368 55 L380 30 L440 30";
  return (
    <div style={{ width: '100%', lineHeight: 0, position: 'relative' }}>
      <svg viewBox="0 0 440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <clipPath id="ecg-clip"><rect x="0" y="0" width="440" height="60" /></clipPath>
          <radialGradient id="sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%"  stopColor="#5eead4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"  />
          </radialGradient>
        </defs>
        {/* Dim static base trace */}
        <path d={PATH} stroke="var(--teal-bright)" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.22" />
        {/* Brighter overlay trace */}
        <path d={PATH} stroke="var(--teal-bright)" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.52"
          clipPath="url(#ecg-clip)" />
        {/* Sweep: gradient rect slides L→R — GPU translateX only */}
        <g clipPath="url(#ecg-clip)">
          <rect x="-88" y="0" width="88" height="60"
            fill="url(#sweep-grad)"
            style={{
              animation: paused ? 'none' : 'ecg-sweep 3s ease-in-out infinite',
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        </g>
      </svg>
      <style>{`
        @keyframes ecg-sweep {
          0%   { transform: translateX(0);     opacity: 0;    }
          8%   { opacity: 0.9; }
          88%  { opacity: 0.9; }
          100% { transform: translateX(528px); opacity: 0;    }
        }
      `}</style>
    </div>
  );
}

/* ─── Metric card — adapts to dark/light theme ───────────── */
function MetricCard({ label, value, unit, color, delay, isDark, paused }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? isDark ? 'rgba(15,118,110,0.18)' : 'rgba(15,118,110,0.06)'
          : isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
        border: `1px solid ${
          hovered
            ? 'rgba(20,184,166,0.45)'
            : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,118,110,0.12)'
        }`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        cursor: 'default',
        transform: hovered ? 'scale(1.025) translateY(-2px)' : 'scale(1)',
        boxShadow: hovered
          ? `0 8px 32px ${color}25, 0 0 0 1px ${color}25`
          : isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s ease, background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <span style={{
        fontSize: 10.5, fontWeight: 600, letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
        fontFamily: "'Inter', sans-serif",
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{
          fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em',
          color: hovered ? color : 'var(--teal)',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'color 0.2s',
        }}>
          {value}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 500,
          color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
        }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <motion.span
          animate={paused ? {} : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }}
        />
        <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }}>Typical range</span>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const { isDark } = useTheme();
  const isScrolling = useScrollPause();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  /* ── Section bg: deep layered gradient, not flat ── */
  const heroBg = isDark
    ? 'linear-gradient(135deg, #081210 0%, #0b1a17 40%, #0e1f1c 70%, #081210 100%)'
    : 'linear-gradient(135deg, #f0efed 0%, #e8f5f3 50%, #f0efed 100%)';

  return (
    <section
      id="home"
      ref={ref}
      style={{
        minHeight: '100vh',
        background: heroBg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* ── Layered background orbs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Top-left teal orb */}
        <motion.div
          animate={isScrolling ? {} : { scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: 560, height: 560, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,118,110,0.22) 0%, transparent 65%)',
            willChange: 'transform', transform: 'translateZ(0)',
          }}
        />
        {/* Bottom-right faint orb */}
        <motion.div
          animate={isScrolling ? {} : { scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '-15%', right: '35%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 65%)',
            willChange: 'transform', transform: 'translateZ(0)',
          }}
        />
        {/* Subtle diagonal noise-like grain */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.025\'/%3E%3C/svg%3E")',
          opacity: 0.5,
        }} />
      </div>

      {/* ── Left panel (58%) — slightly narrower = asymmetry ── */}
      <motion.div
        style={{
          y, opacity,
          flex: '0 0 58%', maxWidth: '58%',
          padding: '0 0 0 var(--section-px)',
          position: 'relative', zIndex: 2,
        }}
        className="hero-left"
      >
        <div style={{ paddingTop: 148, paddingBottom: 80, paddingRight: 64, height: '100%' }}>

          {/* Pill label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ marginBottom: 36 }}
          >
            <span className="badge badge-teal" style={{ padding: '7px 16px', fontSize: 12 }}>
              <motion.span
                animate={{ scale: [1, 1.45, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-bright)', display: 'inline-block' }}
              />
              Your Personal Health Assistant
            </span>
          </motion.div>

          {/* Heading with word highlight ── */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              marginBottom: 26,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              letterSpacing: '-0.05em',
              lineHeight: 1.01,
            }}
          >
            Listen to your<br />
            {/* Highlighted word — underline + glow effect */}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span className="gradient-text">body</span>
              {/* Animated underline bar */}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  bottom: 4, left: 0, right: 0,
                  height: 3, borderRadius: 99,
                  background: 'linear-gradient(90deg, var(--teal-bright), #34d399)',
                  transformOrigin: 'left',
                  boxShadow: '0 2px 12px rgba(20,184,166,0.5)',
                }}
              />
            </span>
            .<br />
            We'll help you understand it.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="body-lg"
            style={{
              color: isDark ? 'rgba(255,255,255,0.48)' : 'var(--light-muted)',
              maxWidth: 420, marginBottom: 40,
              letterSpacing: '-0.005em',
            }}
          >
            Tell us how you're feeling, and we'll give you instant, easy-to-understand advice on what you should do next.
          </motion.p>

          {/* Looping ECG line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            style={{ marginBottom: 32, maxWidth: 380 }}
          >
            <EcgLine />
          </motion.div>

          {/* CTA buttons with hover micro-interaction */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
            style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => document.querySelector('#checker')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: 15 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(15,118,110,0.4)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Check your symptoms
              <ArrowRight size={16} />
            </motion.button>

            <motion.button
              className={isDark ? 'btn-ghost-dark' : 'btn-ghost-light'}
              onClick={() => document.querySelector('#firstaid')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              Quick First Aid
            </motion.button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.68 }}
            style={{
              marginTop: 52, paddingTop: 28,
              borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--light-border)',
              display: 'flex', gap: 28, flexWrap: 'wrap',
            }}
          >
            {[
              { icon: Shield, text: '100% private. We don\'t save your data.' },
              { icon: Zap, text: 'Get answers in seconds' },
              { icon: Activity, text: 'Covers 15+ common health areas' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                <Icon size={13} style={{ color: 'var(--teal-bright)', flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: isDark ? 'rgba(255,255,255,0.32)' : 'var(--light-muted)' }}>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right panel (42%) — floats slightly inset, glassmorphism ── */}
      <div
        className="hero-right"
        style={{
          flex: '0 0 42%', maxWidth: '42%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 120,
          paddingBottom: 60,
          paddingLeft: 24,
          paddingRight: 'var(--section-px)',
          zIndex: 2,
        }}
      >
        {/* The floating glass panel itself — not flush to edge */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            /* Light mode: solid white with strong shadow and teal border — clearly visible
               Dark mode: near-transparent glass with blur */
            background: isDark
              ? 'rgba(255,255,255,0.04)'
              : '#ffffff',
            backdropFilter: isDark ? 'blur(32px)' : 'none',
            WebkitBackdropFilter: isDark ? 'blur(32px)' : 'none',
            border: isDark
              ? '1px solid rgba(255,255,255,0.09)'
              : '1.5px solid rgba(15,118,110,0.18)',
            borderRadius: 24,
            padding: '28px 26px',
            position: 'relative',
            overflow: 'hidden',
            transform: 'rotate(0.4deg)',
            boxShadow: isDark
              ? '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(20,184,166,0.08) inset'
              : '0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Inner radial teal glow */}
          <div style={{
            position: 'absolute', top: '-30%', right: '-10%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(15,118,110,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Scan line — inside glass */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 24 }}>
            <motion.div
              animate={isScrolling ? {} : { y: ['-100%', '300%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              style={{
                width: '100%', height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent)',
              }}
            />
          </div>

          {/* Grid dots (inside panel) */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: isDark
              ? 'radial-gradient(rgba(20,184,166,0.1) 1px, transparent 1px)'
              : 'radial-gradient(rgba(15,118,110,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            borderRadius: 24,
            pointerEvents: 'none',
          }} />

          {/* Content: relative z-index above decorative elements */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="label" style={{
                color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--teal)',
                marginBottom: 20, display: 'block',
              }}>
                Health Insights
              </span>
            </motion.div>

            {/* Metric cards — staggered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <MetricCard label="Heart Rate"   value="60–100" unit="bpm" color="#f43f5e" delay={0.52} isDark={isDark} paused={isScrolling} />
              <MetricCard label="Blood Oxygen" value="95–100" unit="%"  color="#0891b2" delay={0.64} isDark={isDark} paused={isScrolling} />
              <MetricCard label="Temperature"  value="97–99" unit="°F" color="#ea580c" delay={0.76} isDark={isDark} paused={isScrolling} />
            </div>

            {/* Disclaimer */}
            <p style={{
              fontSize: 10.5, color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.32)',
              marginTop: 8, lineHeight: 1.5, fontStyle: 'italic',
            }}>
              For awareness only — not real-time tracking.
            </p>

            {/* Dataset coverage bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.92 }}
              style={{
                marginTop: 14,
                background: isDark ? 'rgba(15,118,110,0.09)' : 'rgba(15,118,110,0.06)',
                border: isDark
                  ? '1px solid rgba(20,184,166,0.15)'
                  : '1px solid rgba(15,118,110,0.2)',
                borderRadius: 14, padding: '14px 16px',
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: 10,
                color: isDark ? 'rgba(255,255,255,0.3)' : 'var(--teal)',
              }}>
                Dataset coverage
              </div>
              {[
                { label: 'Symptoms analyzed', pct: 92 },
                { label: 'Health advisories', pct: 78 },
                { label: 'First aid guides', pct: 100 },
              ].map(({ label, pct }) => (
                <div key={label} style={{ marginBottom: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{
                      fontSize: 11.5,
                      color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-text)',
                      fontWeight: 500,
                    }}>{label}</span>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700,
                      color: isDark ? 'var(--teal-bright)' : 'var(--teal)',
                    }}>{pct}%</span>
                  </div>
                  <div style={{
                    height: 3,
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,118,110,0.12)',
                    borderRadius: 99, overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: 'var(--teal-bright)', borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Mobile stack */}
      <style>{`
        @media (max-width: 900px) {
          .hero-left  { flex: 0 0 100% !important; max-width: 100% !important; padding-right: var(--section-px) !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  );
}
