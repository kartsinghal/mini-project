import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Heart, Wind, Zap, Droplet, Activity, Phone,
  AlertTriangle, Info, ArrowRight, ArrowLeft,
  RefreshCw, List, CheckCircle2, EyeOff, ShieldAlert,
  ChevronRight
} from 'lucide-react';

const EMERGENCIES = [
  {
    id: 'cpr',
    icon: Heart,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    title: 'CPR',
    urgency: 'Life-saving',
    time: '3 min',
    critical: true,
    steps: [
      {
        instruction: 'Call 911 / 112 / 108 immediately',
        detail: 'Do not delay. If you are alone, put the phone on speaker while you start.',
        warning: 'Every minute counts. Do not hang up on the dispatcher.',
      },
      {
        instruction: 'Lay the person flat on their back',
        detail: 'Place them on a firm, flat surface. Tilt their head back slightly and lift the chin.',
        why: 'A firm surface is needed for effective compressions. Tilting the head opens the airway.',
      },
      {
        instruction: 'Place your hands',
        detail: 'Put the heel of your hand on the center of their chest. Place your other hand on top and interlock your fingers.',
      },
      {
        instruction: 'Push hard and fast',
        detail: 'Push straight down at least 5 cm (2 inches). Compress at a rate of 100–120 per minute (the beat of "Stayin\' Alive").',
        why: 'This manually pumps oxygen-rich blood to the brain and vital organs.',
      },
      {
        instruction: 'Do not stop',
        detail: 'Keep going until help arrives, an AED is ready, or the person wakes up.',
      }
    ],
    completionAdvice: 'Keep the person as still as possible and stay with them until paramedics take over.',
  },
  {
    id: 'choking',
    icon: Wind,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.2)',
    title: 'Choking',
    urgency: 'Immediate action',
    time: '1 min',
    critical: true,
    steps: [
      {
        instruction: 'Ask "Are you choking?"',
        detail: 'If they can cough forcefully or speak, do not interfere yet. Encourage them to keep coughing.',
        warning: 'Do not hit them on the back while they are standing upright, it can lodge the object deeper.',
      },
      {
        instruction: 'Give 5 firm back blows',
        detail: 'Lean them forward. Use the heel of your hand between their shoulder blades.',
      },
      {
        instruction: 'Give 5 abdominal thrusts',
        detail: 'Stand behind them. Make a fist above their belly button, grab it with your other hand, and pull inward and upward 5 times.',
      },
      {
        instruction: 'Alternate blows and thrusts',
        detail: 'Keep alternating 5 back blows and 5 abdominal thrusts until the object comes out or they lose consciousness.',
      }
    ],
    completionAdvice: 'If they pass out, immediately begin CPR and call emergency services.',
  },
  {
    id: 'bleeding',
    icon: Droplet,
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.07)',
    border: 'rgba(236,72,153,0.2)',
    title: 'Severe Bleeding',
    urgency: 'Stop the bleed',
    time: '2 min',
    critical: true,
    steps: [
      {
        instruction: 'Apply direct pressure',
        detail: 'Press firmly on the wound with the cleanest cloth available. Do not let go.',
        why: 'Pressure stops the blood flow and allows the blood to start clotting.',
      },
      {
        instruction: 'Do not remove the cloth',
        detail: 'If blood soaks through, do not take the cloth off. Just add more layers on top and press harder.',
        warning: 'Removing the cloth will rip away any clots that have started to form.',
      },
      {
        instruction: 'Elevate the wound',
        detail: 'Raise the bleeding area above heart level if possible.',
      },
      {
        instruction: 'Keep pressing until help arrives',
        detail: 'Maintain steady, heavy pressure until emergency responders take over.',
      }
    ],
    completionAdvice: 'Keep the person warm to prevent shock, and do not remove the pressure.',
  },
  {
    id: 'burns',
    icon: Zap,
    color: '#eab308',
    bg: 'rgba(234,179,8,0.07)',
    border: 'rgba(234,179,8,0.2)',
    title: 'Burns',
    urgency: 'Handle with care',
    time: '3 min',
    critical: false,
    steps: [
      {
        instruction: 'Cool the burn under running water',
        detail: 'Run cool (not cold) water over the burn for at least 15–20 minutes.',
        why: 'Cool water dissipates heat. Ice causes blood vessels to constrict, worsening tissue damage.',
        warning: 'Do NOT apply ice, butter, or ointments directly to a fresh burn.',
      },
      {
        instruction: 'Remove tight items',
        detail: 'Carefully take off rings, watches, or belts near the affected area before swelling starts.',
      },
      {
        instruction: 'Cover the burn gently',
        detail: 'Use a sterile, non-fluffy bandage or clean cling film loosely over the area. Do not wrap tightly.',
      }
    ],
    completionAdvice: 'If the burn is larger than your hand, on the face, or blistered severely, seek medical attention immediately.',
  },
  {
    id: 'stroke',
    icon: Activity,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
    title: 'Stroke (FAST)',
    urgency: 'Time critical',
    time: '2 min',
    critical: true,
    steps: [
      {
        instruction: 'F - Check their Face',
        detail: 'Ask them to smile. Does one side of the face droop?',
      },
      {
        instruction: 'A - Check their Arms',
        detail: 'Ask them to raise both arms. Does one arm drift downward?',
      },
      {
        instruction: 'S - Check their Speech',
        detail: 'Ask them to repeat a simple phrase. Is their speech slurred or strange?',
      },
      {
        instruction: 'T - Time to call 911',
        detail: 'If you observe ANY of these signs, call emergency services immediately.',
        why: 'Brain cells die rapidly without oxygen. Treatment must be given within hours of the first symptom.',
      }
    ],
    completionAdvice: 'Note the exact time the symptoms started. Paramedics will need this information.',
  },
  {
    id: 'fainting',
    icon: EyeOff,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    title: 'Fainting',
    urgency: 'Monitor closely',
    time: '5 min',
    critical: false,
    steps: [
      {
        instruction: 'Lay them flat on their back',
        detail: 'If they just fainted, lay them down and elevate their legs slightly above heart level.',
        why: 'Elevating the legs helps restore blood flow to the brain.',
      },
      {
        instruction: 'Check for breathing',
        detail: 'Ensure their airway is clear and they are breathing normally. If not, begin CPR.',
      },
      {
        instruction: 'Give them space',
        detail: 'Loosen tight clothing, belts, or collars. Keep the area cool and well-ventilated.',
      },
      {
        instruction: 'Do not rush them up',
        detail: 'When they wake up, have them sit quietly for 10-15 minutes before trying to stand.',
      }
    ],
    completionAdvice: 'If they hit their head, have trouble breathing, or stay unconscious for over a minute, call emergency services.',
  },
  {
    id: 'fracture',
    icon: ShieldAlert,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.2)',
    title: 'Fracture / Broken Bone',
    urgency: 'Stabilize',
    time: '4 min',
    critical: false,
    steps: [
      {
        instruction: 'Do not move the area',
        detail: 'Keep the injured limb completely still. Do not try to realign the bone or push it back in.',
        warning: 'Moving a fractured bone can sever nerves or blood vessels.',
      },
      {
        instruction: 'Stop any bleeding',
        detail: 'If there is a wound, apply gentle pressure with a clean cloth, avoiding pressing directly on the bone.',
      },
      {
        instruction: 'Immobilize',
        detail: 'If you must move them, apply a splint to the area above and below the fracture joints to keep it stable.',
      },
      {
        instruction: 'Apply a cold pack',
        detail: 'Wrap ice in a cloth and apply to the area to reduce swelling.',
      }
    ],
    completionAdvice: 'Go to urgent care or the emergency room. If the bone is poking through the skin or the limb is turning blue, call 911 immediately.',
  }
];

// Inner component for a single step
function StepView({ step, total, currentIdx, isDark, urgencyColor }) {
  const [showWhy, setShowWhy] = useState(false);

  if (!step) return null;

  return (
    <motion.div
      key={currentIdx}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Step Counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: '50%',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'var(--light-100)',
          color: isDark ? '#fff' : 'var(--light-text)',
          fontSize: 13, fontWeight: 700,
        }}>
          {currentIdx + 1}
        </span>
        <span style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', fontWeight: 500 }}>
          of {total}
        </span>
      </div>

      {/* Main Instruction */}
      <div>
        <h3 style={{
          fontSize: 26, fontWeight: 700, lineHeight: 1.3,
          color: isDark ? '#fff' : 'var(--light-text)',
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '-0.02em',
          marginBottom: 10,
        }}>
          {step.instruction}
        </h3>
        <p style={{
          fontSize: 16, lineHeight: 1.6,
          color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--light-muted)',
        }}>
          {step.detail}
        </p>
      </div>

      {/* Warning Box */}
      {step.warning && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <AlertTriangle size={18} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: 13, color: '#ef4444', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Important Warning</strong>
            <span style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-text)', lineHeight: 1.5 }}>{step.warning}</span>
          </div>
        </div>
      )}

      {/* Why this matters toggle */}
      {step.why && (
        <div style={{
          borderRadius: 12, border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
          overflow: 'hidden', background: isDark ? 'var(--dark-800)' : '#f9fafb',
        }}>
          <button
            onClick={() => setShowWhy(!showWhy)}
            style={{
              width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 13.5, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={15} style={{ color: urgencyColor }} />
              Why this matters
            </div>
            <motion.div animate={{ rotate: showWhy ? 180 : 0 }}>
              <ChevronRight size={16} />
            </motion.div>
          </button>
          <AnimatePresence>
            {showWhy && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 16px 16px 39px', fontSize: 13.5, color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', lineHeight: 1.55 }}>
                  {step.why}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function EmergencyCard({ em, onClick, isDark, large }) {
  if (!em) return null;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        background: isDark ? 'var(--dark-800)' : '#fff',
        border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
        borderRadius: large ? 20 : 16, padding: large ? '32px' : '24px', cursor: 'pointer', textAlign: 'left',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        height: '100%',
        position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = em.color + '88'; e.currentTarget.style.boxShadow = `0 8px 30px ${em.color}15`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'var(--dark-border)' : 'var(--light-border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: large ? 20 : 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: em.color, ...(large && { boxShadow: `0 0 12px ${em.color}88` }) }} />
        <span style={{ fontSize: large ? 12 : 11, fontWeight: 700, color: em.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {em.urgency}
        </span>
      </div>

      <div style={{ marginBottom: 16, flex: 1 }}>
        <span style={{ fontSize: large ? 28 : 20, fontWeight: 600, fontFamily: "'Poppins', system-ui, sans-serif", letterSpacing: '-0.02em', color: isDark ? '#fff' : 'var(--light-text)', display: 'block', marginBottom: 8 }}>
          {em.title || 'Emergency'}
        </span>
        <span style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
          <span>{em.steps?.length || 0} steps</span> &bull; <span>{em.time || '--'}</span>
        </span>
      </div>

      <div style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6,
        color: isDark ? '#fff' : 'var(--light-text)', fontSize: 13.5, fontWeight: 600,
        paddingTop: 12, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'var(--light-100)'}`,
        width: '100%',
      }}>
        Start Guide <ArrowRight size={14} style={{ color: em.color, marginLeft: 'auto' }} />
      </div>
    </motion.button>
  );
}

export default function FirstAidSection() {
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const activeFlow = EMERGENCIES.find(e => e.id === activeId);

  // Reset state when switching modes or closing
  useEffect(() => {
    setCurrentStep(0);
    setIsCompleted(false);
    setViewAll(false);
  }, [activeId]);

  const handleNext = () => {
    // 1. Step navigation safety & 7. Crash prevention
    if (!activeFlow?.steps || activeFlow.steps.length === 0) return;
    
    // Prevent stale-closure bugs from rapid double clicks out of bounds
    setCurrentStep(prev => {
      if (prev < activeFlow.steps.length - 1) {
        return prev + 1;
      }
      return prev; // Block action
    });
  };

  const handlePrev = () => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  const progressPct = activeFlow?.steps?.length > 0 ? (currentStep / activeFlow.steps.length) * 100 : 0;
  const isLastStep = activeFlow?.steps ? currentStep >= activeFlow.steps.length - 1 : true;

  return (
    <section
      id="firstaid"
      style={{
        background: isDark ? 'var(--dark-900)' : 'var(--light-base)',
        padding: '100px var(--section-px)',
        position: 'relative', minHeight: '80vh'
      }}
    >
      <div style={{ maxWidth: 1000, marginLeft: 0 }}>
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48 }}
        >
          <span className="text-sm uppercase tracking-widest block mb-3 font-semibold" style={{ color: 'var(--coral)' }}>
            Step-by-Step Guides
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-2"
            style={{ color: isDark ? '#fff' : 'var(--light-text)', fontFamily: "'Poppins', sans-serif" }}
          >
            Interactive First Aid
          </h2>
          <p className="body-sm" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--light-muted)', maxWidth: 500 }}>
            Select an emergency for calm, guided instructions on what to do next.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!activeId || !activeFlow ? (
            /* 1. SELECTION SCREEN */
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
            >
              {/* EMERGENCY GROUP */}
              <div>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 24, height: 2, background: '#ef4444', borderRadius: 2 }} /> Emergency
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
                  {EMERGENCIES.filter(e => ['cpr', 'choking'].includes(e.id)).map(em => (
                    <EmergencyCard key={em.id} em={em} onClick={() => setActiveId(em.id)} isDark={isDark} large={true} />
                  ))}
                </div>
              </div>

              {/* URGENT GROUP */}
              <div>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 24, height: 2, background: '#f59e0b', borderRadius: 2 }} /> Urgent
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {EMERGENCIES.filter(e => ['bleeding', 'stroke'].includes(e.id)).map(em => (
                    <EmergencyCard key={em.id} em={em} onClick={() => setActiveId(em.id)} isDark={isDark} />
                  ))}
                </div>
              </div>

              {/* CARE GROUP */}
              <div>
                <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 24, height: 2, background: '#3b82f6', borderRadius: 2 }} /> Care
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  {EMERGENCIES.filter(e => ['burns', 'fainting', 'fracture'].includes(e.id)).map(em => (
                    <EmergencyCard key={em.id} em={em} onClick={() => setActiveId(em.id)} isDark={isDark} />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* 2. ACTIVE FLOW UI */
            <motion.div
              key="flow"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              style={{
                background: isDark ? 'var(--dark-800)' : '#fff',
                border: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                borderRadius: 24, padding: '32px 40px',
                position: 'relative', overflow: 'hidden',
                boxShadow: isDark ? `0 20px 80px ${activeFlow.color}15` : '0 10px 40px rgba(0,0,0,0.05)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={() => setActiveId(null)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--light-100)',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#fff' : 'var(--light-text)',
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {activeFlow?.icon && <activeFlow.icon size={18} color={activeFlow.color} />}
                    <span style={{ fontSize: 18, fontWeight: 700, color: isDark ? '#fff' : 'var(--light-text)', fontFamily: "'Poppins', sans-serif" }}>
                      {activeFlow?.title || 'Details'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {activeFlow.critical && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        padding: '8px 16px', borderRadius: 99, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 600, fontSize: 12.5,
                      }}
                    >
                      <Phone size={14} /> Call 911 / 112
                    </motion.div>
                  )}
                  <button
                    onClick={() => setViewAll(!viewAll)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
                      color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)', fontWeight: 600,
                    }}
                  >
                    <List size={14} /> {viewAll ? 'Guided mode' : 'View all steps'}
                  </button>
                </div>
              </div>

              {!isCompleted && !viewAll && (
                <>
                  {/* Progress Bar (Dynamic styling based on urgency) */}
                  <div style={{ height: 4, background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--light-200)', borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
                    <motion.div
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      style={{ height: '100%', background: activeFlow.color }}
                    />
                  </div>
                  
                  {/* Step Container */}
                  <div style={{ minHeight: 320 }}>
                    <AnimatePresence mode="wait">
                      {(() => {
                        // 2. Rendering safety & 4. Hard guards
                        const steps = activeFlow?.steps;
                        
                        // Debug per user request
                        console.log('--- Step Debug ---');
                        console.log('Current Step Index:', currentStep);
                        console.log('Step Data:', steps?.[currentStep]);
                        
                        if (!steps || steps.length === 0 || !steps[currentStep]) {
                          return (
                            <motion.div 
                              key="fallback-step"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              style={{ padding: 20, textAlign: 'center', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)' }}
                            >
                              Step not available
                            </motion.div>
                          );
                        }

                        return (
                          <StepView
                            key={`step-${activeFlow.id}-${currentStep}`}
                            step={steps[currentStep]}
                            total={steps.length}
                            currentIdx={currentStep}
                            isDark={isDark}
                            urgencyColor={activeFlow.color}
                          />
                        );
                      })()}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* View All Mode */}
              {viewAll && !isCompleted && (
                <div style={{ minHeight: 320, display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 20 }}>
                  {activeFlow?.steps?.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: activeFlow.color, marginTop: 2 }}>{i + 1}.</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: 16, color: isDark ? '#fff' : 'var(--light-text)', marginBottom: 4 }}>{s.instruction}</strong>
                        <span style={{ fontSize: 13.5, color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)' }}>{s.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completion Screen */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                  <CheckCircle2 size={56} color="#22c55e" style={{ marginBottom: 20 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#fff' : 'var(--light-text)', marginBottom: 12 }}>You've reached the end</h3>
                  <p style={{ fontSize: 15, color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--light-muted)', maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
                    {activeFlow.completionAdvice}
                  </p>
                  <button
                    onClick={() => setActiveId(null)}
                    style={{
                      padding: '12px 24px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.1)' : 'var(--light-200)',
                      border: 'none', color: isDark ? '#fff' : 'var(--light-text)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Back to Selection
                  </button>
                </motion.div>
              )}

              {/* Footer Nav Controls */}
              {!isCompleted && !viewAll && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 20, paddingTop: 24, borderTop: `1px solid ${isDark ? 'var(--dark-border)' : 'var(--light-border)'}`,
                }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0 || !activeFlow?.steps}
                    style={{
                      padding: '12px 20px', borderRadius: 12, background: 'transparent', border: 'none',
                      color: currentStep === 0 ? (isDark ? 'rgba(255,255,255,0.2)' : 'var(--light-muted)') : (isDark ? '#fff' : 'var(--light-text)'),
                      fontSize: 14.5, fontWeight: 600, cursor: currentStep === 0 ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
                    }}
                  >
                    {currentStep > 0 && <ArrowLeft size={16} />} Previous
                  </button>

                  <motion.button
                    onClick={handleNext}
                    disabled={isLastStep}
                    whileHover={{ scale: isLastStep ? 1 : 1.02 }}
                    whileTap={{ scale: isLastStep ? 1 : 0.98 }}
                    style={{
                      padding: '12px 24px', borderRadius: 12, background: activeFlow.color, border: 'none',
                      color: '#fff', fontSize: 14.5, fontWeight: 600, cursor: isLastStep ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 8, boxShadow: `0 4px 12px ${activeFlow.color}44`,
                      opacity: isLastStep ? 0.5 : 1,
                    }}
                  >
                    Next Step <ArrowRight size={16} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
