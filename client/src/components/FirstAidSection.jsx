import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Heart, Wind, Zap, Droplet, Activity, Phone, ChevronRight } from 'lucide-react';

const ITEMS = [
  {
    id: 'cpr',
    num: '01',
    icon: Heart,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    urgency: 'Emergency',
    title: 'CPR',
    subtitle: 'Cardiopulmonary Resuscitation',
    steps: [
      { label: 'Call for help', detail: 'Dial 108 / 112 / 911 immediately. Do not delay — 60 seconds matter.' },
      { label: 'Positioning', detail: 'Lay person flat on their back on a firm surface. Tilt head back, lift chin.' },
      { label: 'Compressions', detail: 'Heel of hand on center of chest. Arms straight, push down 5+ cm at 100–120/min.' },
      { label: 'Rhythm', detail: 'Use the beat of "Stayin\' Alive" by Bee Gees — 100 BPM is the target.' },
      { label: 'Rescue Breaths', detail: 'If trained: 30 compressions, 2 rescue breaths. Otherwise: continue compressions only.' },
      { label: 'Continue until', detail: 'Professional help arrives, person shows signs of life, or you are physically unable to continue.' },
    ],
  },
  {
    id: 'choking',
    num: '02',
    icon: Wind,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    urgency: 'Act fast',
    title: 'Choking',
    subtitle: 'Heimlich Maneuver',
    steps: [
      { label: 'Encourage coughing', detail: 'If they can cough forcefully, encourage them to keep coughing.' },
      { label: 'Back blows', detail: 'Lean them forward, give 5 firm blows between shoulder blades with heel of hand.' },
      { label: 'Abdominal thrusts', detail: 'Stand behind, wrap arms around waist. Make fist above belly button. 5 inward-upward thrusts.' },
      { label: 'Alternate', detail: 'Alternate 5 back blows and 5 thrusts until object dislodged or person loses consciousness.' },
    ],
  },
  {
    id: 'burns',
    num: '03',
    icon: Zap,
    color: '#eab308',
    bg: 'rgba(234,179,8,0.07)',
    border: 'rgba(234,179,8,0.2)',
    urgency: 'Common',
    title: 'Burns',
    subtitle: 'Thermal burn first aid',
    steps: [
      { label: 'Cool the burn', detail: 'Run cool (not cold, not ice) water over the burn for at least 20 minutes.' },
      { label: 'Remove hazards', detail: 'Carefully remove rings, watches, belts near the affected area before swelling.' },
      { label: 'Cover', detail: 'Use a sterile non-fluffy bandage or cling film loosely. Do not wrap tightly.' },
      { label: 'Avoid home remedies', detail: 'Do NOT apply toothpaste, butter, oil, cream, or any household product.' },
    ],
  },
  {
    id: 'bleeding',
    num: '04',
    icon: Droplet,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.07)',
    border: 'rgba(236,72,153,0.2)',
    urgency: 'Critical',
    title: 'Severe Bleeding',
    subtitle: 'Wound control',
    steps: [
      { label: 'Apply direct pressure', detail: 'Press firmly with the cleanest cloth available. Maintain steady pressure.' },
      { label: 'Do not remove cloth', detail: 'If cloth soaks through, add more on top — do not remove the first layer.' },
      { label: 'Elevate', detail: 'Raise the wounded area above heart level if possible, without causing pain.' },
      { label: 'Tourniquet (last resort)', detail: 'Apply 5–7 cm above wound. Note time applied. Loosen every 20 min if help is delayed.' },
    ],
  },
  {
    id: 'stroke',
    num: '05',
    icon: Activity,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    urgency: 'Time critical',
    title: 'Stroke — FAST Test',
    subtitle: 'Recognize & respond immediately',
    steps: [
      { label: 'F — Face', detail: 'Ask the person to smile. Check if one side of the face droops.' },
      { label: 'A — Arms', detail: 'Ask to raise both arms. Does one drift down or is one arm weak?' },
      { label: 'S — Speech', detail: 'Ask to repeat a simple phrase. Is speech slurred, strange, or absent?' },
      { label: 'T — Time', detail: 'ANY one of the above signs → Call 108/112/911 IMMEDIATELY. Every minute = 1.9M neurons lost.' },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle, isDark, globalIdx }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: globalIdx * 0.07 }}
      style={{
        borderRadius: 16,
        border: `1px solid ${isOpen ? item.color + '44' : isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
        background: isOpen
          ? isDark ? item.bg : item.bg
          : isDark ? 'var(--dark-800)' : '#fff',
        overflow: 'hidden',
        transition: 'border-color 0.25s, background 0.25s',
        boxShadow: isOpen ? `0 0 0 1px ${item.color}22, 0 12px 40px ${item.color}10` : 'none',
      }}
    >
      {/* ── Accordion trigger ─────────────────────────── */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '18px 22px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto',
          alignItems: 'center',
          gap: 16,
          textAlign: 'left',
        }}
      >
        {/* Number + icon combined */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: isOpen ? item.color : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            fontFamily: "'Inter', sans-serif",
          }}>
            {item.num}
          </span>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: isOpen ? item.bg : isDark ? 'rgba(255,255,255,0.05)' : 'var(--light-100)',
            border: `1px solid ${isOpen ? item.border : 'transparent'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, border 0.2s',
          }}>
            <Icon size={17} style={{ color: isOpen ? item.color : isDark ? 'rgba(255,255,255,0.35)' : 'var(--light-muted)' }} />
          </div>
        </div>

        {/* Title group */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: 16,
              color: isDark ? '#fff' : 'var(--light-text)',
              letterSpacing: '-0.02em',
              transition: 'color 0.2s',
            }}>
              {item.title}
            </span>
            <span style={{
              padding: '2px 9px', borderRadius: 99, fontSize: 10.5, fontWeight: 600,
              background: isOpen ? item.bg : 'transparent',
              border: `1px solid ${isOpen ? item.border : isDark ? 'rgba(255,255,255,0.1)' : 'var(--light-border)'}`,
              color: isOpen ? item.color : isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s',
            }}>
              {item.urgency}
            </span>
          </div>
          <span style={{ fontSize: 12.5, color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--light-muted)' }}>
            {item.subtitle}
          </span>
        </div>

        {/* Step count */}
        <span style={{ fontSize: 11, color: isDark ? 'rgba(255,255,255,0.2)' : '#c7c4be', fontWeight: 500 }}>
          {item.steps.length} steps
        </span>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.22 }}
          style={{ color: isOpen ? item.color : isDark ? 'rgba(255,255,255,0.2)' : 'var(--light-muted)' }}
        >
          <ChevronRight size={18} />
        </motion.div>
      </button>

      {/* ── Expanded steps ────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              borderTop: `1px solid ${item.color}25`,
              padding: '20px 22px 22px',
            }}>
              {/* Step list with vertical left-rail */}
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: 17, top: 8, bottom: 8,
                  width: 1,
                  background: `linear-gradient(to bottom, ${item.color}50, transparent)`,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {item.steps.map((step, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: j * 0.05 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 16,
                        padding: '10px 0',
                      }}
                    >
                      {/* Step dot */}
                      <div style={{
                        width: 35, flexShrink: 0,
                        display: 'flex', justifyContent: 'center', paddingTop: 3,
                      }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: j === 0 ? item.bg : isDark ? 'rgba(255,255,255,0.04)' : 'var(--light-100)',
                          border: `1px solid ${j === 0 ? item.color + '55' : isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700,
                          color: j === 0 ? item.color : isDark ? 'rgba(255,255,255,0.3)' : 'var(--light-muted)',
                          fontFamily: "'Inter', sans-serif",
                        }}>
                          {j + 1}
                        </div>
                      </div>

                      {/* Step text */}
                      <div style={{ flex: 1, paddingTop: 6 }}>
                        <span style={{
                          display: 'block', fontSize: 13.5, fontWeight: 600,
                          color: isDark ? '#fff' : 'var(--light-text)',
                          fontFamily: "'Poppins', sans-serif",
                          letterSpacing: '-0.01em',
                          marginBottom: 3,
                        }}>
                          {step.label}
                        </span>
                        <span style={{
                          fontSize: 12.5, lineHeight: 1.6,
                          color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)',
                          display: 'block',
                        }}>
                          {step.detail}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FirstAidSection() {
  const { isDark } = useTheme();
  const [openId, setOpenId] = useState('cpr'); // First open by default

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="firstaid"
      style={{
        background: isDark
          ? 'var(--dark-900)'
          : 'var(--light-base)',
        padding: '100px var(--section-px)',
        position: 'relative',
      }}
    >
      {/* Vertical coral accent bar on left edge — unique asymmetric element */}
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: 3,
        background: 'linear-gradient(to bottom, transparent, var(--coral), transparent)',
        opacity: 0.5,
      }} />

      <div style={{ maxWidth: 1000, marginLeft: 0 }}>

        {/* Header — left-aligned with right-floating emergency numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20, marginBottom: 48,
          }}
        >
          <div>
            <span className="text-sm uppercase tracking-widest block mb-3 font-semibold" style={{ color: 'var(--coral)' }}>
              Emergency Procedures
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-2"
              style={{
                color: isDark ? '#fff' : 'var(--light-text)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              CPR & First Aid
            </h2>
          </div>

          {/* Emergency number chips — vertical stack, unique layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            {[{ label: 'Emergency', number: '112' }, { label: 'Ambulance', number: '108' }].map(({ label, number }) => (
              <div key={number} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 14px', borderRadius: 99,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <Phone size={11} style={{ color: '#ef4444' }} />
                <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', fontFamily: "'Space Grotesk', sans-serif" }}>{number}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accordion list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ITEMS.map((item, i) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
              isDark={isDark}
              globalIdx={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
