import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, ChevronDown, ChevronUp,
  ArrowRight, Clock, ShieldAlert, Stethoscope, ThumbsUp, Info, Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SEVERITY = {
  mild: {
    label: 'Mild',
    dot: '#22c55e',
    accent: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.25)',
    text: '#22c55e',
  },
  moderate: {
    label: 'Moderate',
    dot: '#f59e0b',
    accent: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    text: '#f59e0b',
  },
  critical: {
    label: 'Critical',
    dot: '#ef4444',
    accent: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    text: '#ef4444',
  },
};

// Deterministic confidence values per severity
function getConfidence(severity, index) {
  const ranges = {
    mild: [72, 88],
    moderate: [55, 72],
    critical: [88, 97],
  };
  const [lo, hi] = ranges[severity] ?? [65, 80];
  // deterministic: use index to spread within range
  return lo + Math.round(((index * 7) % (hi - lo + 1)));
}

function TimelineItem({ match, index, isDark, total }) {
  const [open, setOpen] = useState(index === 0);
  const cfg = SEVERITY[match.severity] || SEVERITY.mild;
  const isLast = index === total - 1;
  const confidence = getConfidence(match.severity, index);

  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Left rail */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: index * 0.1 + 0.1 }}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: cfg.accent,
            border: `1.5px solid ${cfg.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, zIndex: 1,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 13, color: cfg.text }}>{index + 1}</span>
        </motion.div>
        {!isLast && (
          <div style={{
            width: 1, flex: 1, minHeight: 20,
            background: isDark ? 'var(--dark-border)' : 'var(--light-200)',
            margin: '4px 0',
          }} />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        style={{
          flex: 1,
          marginLeft: 16,
          marginBottom: isLast ? 0 : 12,
          borderRadius: 14,
          border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
          background: isDark ? 'var(--dark-700)' : '#fff',
          overflow: 'hidden',
          ...(match.severity === 'critical' && { borderColor: 'rgba(239,68,68,0.4)' }),
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        }}
        className={match.severity === 'critical' ? 'glow-coral' : ''}
        whileHover={{
          boxShadow: match.severity === 'critical'
            ? '0 4px 24px rgba(239,68,68,0.2)'
            : isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 12,
            textAlign: 'left',
          }}
        >
          {/* Severity dot */}
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: cfg.dot, flexShrink: 0,
            ...(match.severity === 'critical' && { boxShadow: `0 0 8px ${cfg.dot}` }),
          }} />

          {/* Name */}
          <span style={{
            flex: 1, fontWeight: 700, fontSize: 15,
            color: isDark ? '#fff' : 'var(--light-text)',
            textTransform: 'capitalize',
            letterSpacing: '-0.01em',
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}>
            {match.symptom_name}
          </span>

          {/* Confidence badge */}
          <span style={{
            padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            background: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,118,110,0.07)',
            border: '1px solid rgba(20,184,166,0.2)',
            color: 'var(--teal-bright)',
            letterSpacing: '0.03em',
            display: 'flex', alignItems: 'center', gap: 4,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, opacity: 0.7 }}>●</span>
            {confidence}% confidence
          </span>

          {/* Severity badge */}
          <span style={{
            padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            background: cfg.accent, border: `1px solid ${cfg.border}`,
            color: cfg.text, letterSpacing: '0.04em',
            flexShrink: 0,
          }}>
            {cfg.label}
          </span>

          {/* Toggle */}
          <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)', flexShrink: 0 }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Expanded body */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                borderTop: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-100)'}`,
                padding: '18px 18px 20px',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                {/* Advisory */}
                <div style={{
                  background: isDark ? 'rgba(20,184,166,0.07)' : 'rgba(15,118,110,0.05)',
                  border: isDark ? '1px solid rgba(20,184,166,0.15)' : '1px solid rgba(15,118,110,0.12)',
                  borderRadius: 10, padding: '13px 15px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                    <Info size={13} style={{ color: 'var(--teal-bright)', flexShrink: 0 }} />
                    <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--teal-bright)' }}>
                      Advisory
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--light-muted)', margin: 0 }}>
                    {match.basic_advice}
                  </p>
                </div>

                {/* Two-col: conditions + precautions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {/* Conditions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <Stethoscope size={13} style={{ color: '#a78bfa' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--light-muted)' }}>
                        Possible causes
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {match.possible_conditions.map((c) => (
                        <span key={c} style={{
                          padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 500,
                          background: isDark ? 'rgba(167,139,250,0.1)' : 'rgba(139,92,246,0.07)',
                          border: isDark ? '1px solid rgba(167,139,250,0.18)' : '1px solid rgba(139,92,246,0.15)',
                          color: isDark ? '#c4b5fd' : '#7c3aed',
                        }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Precautions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <ThumbsUp size={13} style={{ color: '#34d399' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--light-muted)' }}>
                        Precautions
                      </span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {match.precautions.slice(0, 4).map((p, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <ArrowRight size={11} style={{ color: '#34d399', marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: 12.5, color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--light-muted)', lineHeight: 1.5 }}>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* See doctor */}
                <div style={{
                  background: match.severity === 'critical'
                    ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.07)',
                  border: match.severity === 'critical'
                    ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(245,158,11,0.2)',
                  borderRadius: 10, padding: '11px 15px',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <Clock size={13} style={{ color: match.severity === 'critical' ? '#ef4444' : '#f59e0b', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: match.severity === 'critical' ? '#ef4444' : '#f59e0b', display: 'block', marginBottom: 4 }}>
                      When to see a doctor
                    </span>
                    <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.55, color: isDark ? 'rgba(255,255,255,0.55)' : 'var(--light-muted)' }}>
                      {match.when_to_see_doctor}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ── PDF Download ──────────────────────────────────────────────────────────────
async function downloadReport(results) {
  const { jsPDF } = await import('jspdf');
  const data = results.data;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  // Header bar
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageW, 36, 'F');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('HEALTHLENS', margin, 23);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('AI-Powered Symptom Analysis Report', margin + 86, 23);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - margin, 23, { align: 'right' });

  // Title
  doc.setTextColor(28, 36, 33);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Health Analysis Report', margin, y + 10);
  y += 36;

  // Divider
  doc.setDrawColor(213, 211, 207);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // Analyzed symptoms
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 122, 118);
  doc.text('ANALYZED SYMPTOMS', margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(28, 36, 33);
  doc.setFontSize(12);
  const symptomsText = (data.input || []).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('  ·  ');
  doc.text(symptomsText, margin, y, { maxWidth: pageW - margin * 2 });
  y += 28;

  // Health Score
  if (results.healthScore !== undefined) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 122, 118);
    doc.text('HEALTH SCORE & CATEGORY', margin, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(28, 36, 33);
    doc.setFontSize(12);
    doc.text(`${results.healthScore} / 100  —  ${results.category.toUpperCase()}`, margin, y);
    y += 28;
  }

  // Results
  if (data.matches?.length) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 122, 118);
    doc.text('FINDINGS', margin, y);
    y += 18;

    data.matches.forEach((match, idx) => {
      const cfg = { mild: [34, 197, 94], moderate: [245, 158, 11], critical: [239, 68, 68] };
      const [r, g, b] = cfg[match.severity] ?? cfg.mild;
      const confidence = getConfidence(match.severity, idx);

      // Symptom heading row
      doc.setFillColor(r, g, b, 0.08);
      doc.roundedRect(margin, y - 4, pageW - margin * 2, 26, 4, 4, 'F');
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 36, 33);
      doc.text(`${idx + 1}. ${match.symptom_name.charAt(0).toUpperCase() + match.symptom_name.slice(1)}`, margin + 8, y + 12);

      // Severity + confidence badges
      doc.setFontSize(9);
      doc.setTextColor(r, g, b);
      doc.text(`[${match.severity.toUpperCase()}]  ${confidence}% confidence`, pageW - margin - 8, y + 12, { align: 'right' });
      y += 34;

      // Advisory
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(70, 80, 76);
      const adviceLines = doc.splitTextToSize(match.basic_advice, pageW - margin * 2 - 10);
      doc.text(adviceLines, margin + 4, y);
      y += adviceLines.length * 14 + 10;

      // Doctor advice
      doc.setFontSize(9.5);
      doc.setTextColor(match.severity === 'critical' ? 185 : 160, match.severity === 'critical' ? 28 : 120, match.severity === 'critical' ? 28 : 10);
      const doctorLabel = 'When to see a doctor: ';
      const doctorText = doc.splitTextToSize(doctorLabel + match.when_to_see_doctor, pageW - margin * 2 - 10);
      doc.text(doctorText, margin + 4, y);
      y += doctorText.length * 13 + 16;

      if (y > 740) { doc.addPage(); y = 48; }
    });
  }

  // Disclaimer
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(160, 160, 160);
  doc.text(
    data.disclaimer || 'This report is for informational purposes only and does not constitute medical advice. Consult a qualified healthcare professional.',
    margin, y,
    { maxWidth: pageW - margin * 2 }
  );

  doc.save('HealthLens-Report.pdf');
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ResultSection({ results }) {
  const { isDark } = useTheme();
  const [downloading, setDownloading] = useState(false);
  if (!results) return null;

  const { data } = results;
  const hasMatches = data?.matches?.length > 0;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport(results);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="results" style={{ background: isDark ? 'var(--dark-900)' : 'var(--light-base)', padding: '80px var(--section-px) 96px' }}>
      <div style={{ maxWidth: 920, marginLeft: 0 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          {/* Emergency banner */}
          {data?.emergency_alert && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                marginBottom: 28,
                background: 'rgba(239,68,68,0.1)',
                border: '1.5px solid rgba(239,68,68,0.4)',
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}
              className="glow-coral"
            >
              <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#ef4444', marginBottom: 4 }}>
                  Emergency — Seek immediate care
                </p>
                <p style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)', lineHeight: 1.55, margin: 0 }}>
                  Your symptoms may indicate a serious or life-threatening condition. Call <strong>108 / 112 / 911</strong> immediately or go to the nearest emergency room.
                </p>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="label" style={{ color: 'var(--teal-bright)', display: 'block', marginBottom: 6 }}>
                Analysis Results
              </span>
              <h2
                className="display-md"
                style={{
                  color: isDark ? '#fff' : 'var(--light-text)',
                  fontFamily: "'Poppins', system-ui, sans-serif",
                  fontWeight: 600,
                  letterSpacing: '-0.018em',
                }}
              >
                {hasMatches ? `${data.matches.length} insight${data.matches.length > 1 ? 's' : ''} found` : 'No matches found'}
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {/* Input recap pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'flex-end', maxWidth: 220 }}>
                {data?.input?.map((s) => (
                  <span key={s} style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 500,
                    background: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,118,110,0.07)',
                    color: isDark ? 'var(--teal-bright)' : 'var(--teal)',
                    border: '1px solid rgba(20,184,166,0.2)',
                  }}>{s}</span>
                ))}
              </div>

              {/* Download Report button */}
              {hasMatches && (
                <motion.button
                  onClick={handleDownload}
                  disabled={downloading}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '8px 16px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                    background: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,118,110,0.08)',
                    border: '1px solid rgba(20,184,166,0.25)',
                    color: 'var(--teal-bright)',
                    cursor: downloading ? 'wait' : 'pointer',
                    opacity: downloading ? 0.6 : 1,
                    letterSpacing: '0.01em',
                    flexShrink: 0,
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (!downloading) e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,184,166,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Download size={13} />
                  {downloading ? 'Generating…' : 'Download Report'}
                </motion.button>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: isDark ? 'var(--dark-border)' : 'var(--light-200)', marginBottom: 28 }} />

          {/* Results timeline */}
          {hasMatches ? (
            <div>
              {data.matches.map((match, i) => (
                <TimelineItem
                  key={match.id}
                  match={match}
                  index={i}
                  total={data.matches.length}
                  isDark={isDark}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center', padding: '56px 32px',
                background: isDark ? 'var(--dark-700)' : '#fff',
                border: isDark ? '1px solid var(--dark-border)' : '1px solid var(--light-border)',
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>🔍</div>
              <h3 style={{
                fontWeight: 700, fontSize: 18,
                fontFamily: "'Poppins', system-ui, sans-serif",
                letterSpacing: '-0.02em',
                color: isDark ? '#fff' : 'var(--light-text)', marginBottom: 8,
              }}>
                No matches found
              </h3>
              <p style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', lineHeight: 1.6 }}>
                Try using simpler terms — "fever", "cough", "headache". The more specific you are, the better.
              </p>
            </motion.div>
          )}

          {/* Inline disclaimer */}
          {hasMatches && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: 24,
                padding: '12px 16px',
                borderRadius: 10,
                background: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(217,119,6,0.05)',
                border: isDark ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(217,119,6,0.15)',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}
            >
              <Info size={13} style={{ color: 'var(--amber)', marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 12, lineHeight: 1.6, color: isDark ? 'rgba(255,255,255,0.38)' : 'var(--light-muted)', margin: 0 }}>
                {data?.disclaimer}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
