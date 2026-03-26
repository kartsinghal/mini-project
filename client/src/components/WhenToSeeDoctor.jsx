import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Home, Stethoscope, ShieldAlert, AlertTriangle, ChevronRight, X } from 'lucide-react';

const URGENCY_LEVELS = [
  {
    id: 'mild',
    level: 'Mild',
    subtitle: 'Stay Home',
    shortDesc: 'Feels manageable. You can take care of this at home.',
    examples: ['Mild headache', 'Low-grade fever'],
    summaryDesc: 'Get some rest and try over-the-counter medicine. Take it easy—if things don’t improve in a few days, it might be worth a check-up.',
    tips: [
      'Rest and drink plenty of water or clear fluids.',
      'Use over-the-counter medicine to relieve discomfort.',
      'Monitor your symptoms to see if they improve.'
    ],
    escalation: 'If symptoms worsen unexpectedly or don\'t improve after a few days, reach out to a doctor.',
    action: 'View Care Tips',
    icon: Home,
    gradient: 'from-[#22c55e] to-[#16a34a]', // Green
    glowConfig: 'rgba(34,197,94,0.15)',
    borderHover: 'group-hover:border-[#22c55e]/30 hover:border-[#22c55e]/30',
    bgHover: 'group-hover:bg-[#22c55e]/[0.02] hover:bg-[#22c55e]/[0.02]',
    activeBorder: 'border-[#22c55e]/50',
    activeBg: 'bg-[#22c55e]/[0.06]',
  },
  {
    id: 'moderate',
    level: 'Moderate',
    subtitle: 'Consult Doctor',
    shortDesc: 'Not getting better? It might be time to check with a doctor.',
    examples: ['Persistent cough', 'Fever over 38°C'],
    summaryDesc: 'It’s a good idea to chat with a professional. Schedule a regular appointment or hop on a quick telehealth call to make sure you’re on the right track.',
    tips: [
      'Schedule a routine appointment or try a telehealth visit.',
      'Write down a quick timeline of your symptoms to share.',
      'Take it easy and avoid strenuous activities for now.'
    ],
    escalation: 'If your condition escalates quickly before your appointment, head to an urgent care center.',
    action: 'Find a Doctor',
    icon: Stethoscope,
    gradient: 'from-[#eab308] to-[#ca8a04]', // Yellow
    glowConfig: 'rgba(234,179,8,0.15)',
    borderHover: 'group-hover:border-[#eab308]/30 hover:border-[#eab308]/30',
    bgHover: 'group-hover:bg-[#eab308]/[0.02] hover:bg-[#eab308]/[0.02]',
    activeBorder: 'border-[#eab308]/50',
    activeBg: 'bg-[#eab308]/[0.06]',
  },
  {
    id: 'severe',
    level: 'Severe',
    subtitle: 'Urgent Care',
    shortDesc: 'This needs attention soon. Don’t wait too long.',
    examples: ['High fever (39°C+)', 'Heavy localized pain'],
    summaryDesc: 'Don’t wait for this to pass. Head down to your local urgent care center or see a professional today so they can get you back on your feet properly.',
    tips: [
      'Head down to your local urgent care center today.',
      'Do not wait for the symptoms to pass on their own.',
      'Bring a list of any medications you are currently taking.',
      'Have someone drive you if you feel weak or dizzy.'
    ],
    escalation: 'If you suddenly develop life-threatening symptoms, call emergency services right away.',
    action: 'Find Urgent Care',
    icon: ShieldAlert,
    gradient: 'from-[#f97316] to-[#ea580c]', // Orange
    glowConfig: 'rgba(249,115,22,0.15)',
    borderHover: 'group-hover:border-[#f97316]/30 hover:border-[#f97316]/30',
    bgHover: 'group-hover:bg-[#f97316]/[0.02] hover:bg-[#f97316]/[0.02]',
    activeBorder: 'border-[#f97316]/50',
    activeBg: 'bg-[#f97316]/[0.06]',
  },
  {
    id: 'critical',
    level: 'Critical',
    subtitle: 'Emergency',
    shortDesc: 'This could be serious. Get help immediately.',
    examples: ['Chest pain', 'Trouble breathing'],
    summaryDesc: 'This is an emergency. Please don’t try to drive yourself—call 911 or head straight to the nearest emergency room right now. Your safety comes first.',
    tips: [
      'Call emergency services (112, 911, etc.) immediately.',
      'Do not attempt to drive yourself to the hospital.',
      'Unlock your front door so emergency responders can enter.',
      'Stay as calm as possible and take slow, steady breaths.'
    ],
    escalation: 'This is an emergency—every minute matters. Do not hesitate to make the call.',
    action: 'Call emergency',
    icon: AlertTriangle,
    gradient: 'from-[#ef4444] to-[#dc2626]', // Red
    glowConfig: 'rgba(239,68,68,0.25)',
    borderHover: 'group-hover:border-[#ef4444]/40 hover:border-[#ef4444]/40',
    bgHover: 'group-hover:bg-[#ef4444]/[0.04] hover:bg-[#ef4444]/[0.04]',
    activeBorder: 'border-[#ef4444]/60',
    activeBg: 'bg-[#ef4444]/[0.10]',
    pulse: true,
  },
];

export default function WhenToSeeDoctor() {
  const { isDark } = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedModal, setSelectedModal] = useState(null);

  return (
    <Fragment>
    <section 
      className={`relative py-32 px-6 lg:px-12 overflow-hidden ${
        isDark ? 'bg-[#0b0f0e]' : 'bg-[#fcfdfd]'
      }`}
    >
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-[0.12] ${
          isDark ? 'bg-gradient-to-b from-[#0FA77F]/30 to-transparent' : 'bg-gradient-to-b from-[#0FA77F]/15 to-transparent'
        }`} />
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-[#0FA77F]/20 bg-[#0FA77F]/5 text-[#0FA77F] text-[13px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(15,167,127,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0FA77F] animate-pulse" />
            Decision Support
          </div>
          
          <h2 className={`text-4xl md:text-[52px] leading-tight font-extrabold tracking-tight mb-5 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            When should you <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0FA77F] to-[#22c55e]">see a doctor?</span>
          </h2>
          
          <p className={`text-[18px] md:text-[20px] leading-relaxed font-semibold tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Not sure if it’s serious? Here’s how to decide.
          </p>
        </motion.div>

        {/* 4-Level Grid - Utilizing Gap 8 (32px) for breathability */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {URGENCY_LEVELS.map((col, index) => {
            const Icon = col.icon;
            const isExpanded = expandedId === col.id;
            
            return (
              <motion.div
                key={col.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                onClick={() => setExpandedId(isExpanded ? null : col.id)}
                className="relative group h-full cursor-pointer"
              >
                {/* Advanced Hover Glow Layer */}
                <div 
                  className={`absolute inset-0 rounded-[2.5rem] transition-opacity duration-700 blur-[24px] pointer-events-none ${
                    isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ background: col.glowConfig }}
                />

                {/* Glassmorphic Card Surface - Increased Padding to p-10 (40px) */}
                <div className={`relative h-full flex flex-col p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 ease-out will-change-transform overflow-hidden ${
                  !isExpanded && 'group-hover:-translate-y-2'
                } ${
                  isDark 
                    ? `shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl ${
                        isExpanded ? `${col.activeBg} ${col.activeBorder}` : `bg-[#111715]/80 border-white/5 ${col.bgHover} ${col.borderHover}`
                      }` 
                    : `shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-xl ${
                        isExpanded ? `${col.activeBg} ${col.activeBorder}` : `bg-white/80 border-gray-100/80 ${col.bgHover} ${col.borderHover}`
                      }`
                }`}>
                  
                  {/* Icon & Title */}
                  <div className="flex flex-col gap-5 mb-6">
                    <div className={`w-[52px] h-[52px] rounded-[1.2rem] flex items-center justify-center bg-gradient-to-br ${col.gradient} shadow-[0_4px_16px_rgba(0,0,0,0.1)] relative flex-shrink-0`}>
                      <Icon size={22} className="text-white relative z-10" />
                      {/* Pulse ring for critical */}
                      {col.pulse && (
                        <span className="absolute inset-0 rounded-[1.2rem] border-2 border-white opacity-40 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-[26px] font-bold tracking-tight leading-none mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {col.level}
                      </h3>
                      <div className={`text-[12.5px] font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${col.gradient}`}>
                        {col.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className={`text-[15px] font-medium leading-relaxed mb-8 flex-grow ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {col.shortDesc}
                  </p>

                  {/* Examples (List - strict 2 item max) */}
                  <div className="mb-2">
                    <ul className="space-y-3 text-[14.5px] font-semibold">
                      {col.examples.map((ex, i) => (
                        <li key={i} className={`flex items-start gap-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className={`w-[6px] h-[6px] rounded-full mt-[8px] flex-shrink-0 bg-gradient-to-r ${col.gradient}`} />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expanded Content View */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-6 pt-5 border-t flex justify-center ${
                          isDark ? 'border-white/10' : 'border-gray-200/60'
                        }`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModal(col);
                            }}
                            className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold text-white transition-all hover:scale-[1.02] shadow-[0_4px_12px_rgba(0,0,0,0.1)] bg-gradient-to-r ${col.gradient}`}
                          >
                            {col.action} <ChevronRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Learn More Toggle Indicator */}
                  {!isExpanded && (
                    <div className={`mt-6 pt-5 border-t flex items-center gap-2 text-[13.5px] font-bold transition-colors ${
                      isDark ? 'border-white/5 text-gray-500 group-hover:text-gray-300' : 'border-gray-100/80 text-gray-400 group-hover:text-gray-600'
                    }`}>
                      Click to expand <ChevronRight size={14} className="opacity-70" />
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center mt-20"
        >
          <p className={`text-[13px] font-medium tracking-wide ${isDark ? 'text-gray-500/70' : 'text-gray-400'}`}>
            This is for awareness only, not a medical diagnosis.
          </p>
        </motion.div>

      </div>
    </section>

      {/* Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 mb-safe pt-safe">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedModal(null)}
              className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
              className={`relative w-full max-w-lg overflow-hidden rounded-[24px] border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ${
                isDark 
                  ? 'bg-[#111715] border-white/10' 
                  : 'bg-white border-gray-100'
              }`}
            >
              {/* Colored Header Area */}
              <div className={`h-28 bg-gradient-to-r ${selectedModal.gradient} flex items-center px-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 pt-4 pr-4 opacity-20 pointer-events-none transform translate-x-4 -translate-y-4 shadow-2xl">
                  <selectedModal.icon size={110} className="text-white drop-shadow-lg" />
                </div>
                
                <button 
                  onClick={() => setSelectedModal(null)}
                  className={`absolute top-4 right-4 w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full transition-colors ${isDark ? 'bg-black/30 text-white/90 hover:bg-black/50 hover:text-white' : 'bg-black/20 text-white/90 hover:bg-black/30 hover:text-white'}`}
                >
                  <X size={18} />
                </button>

                <div className="relative z-10">
                  <h3 className="text-[26px] font-extrabold text-white mb-1 shadow-sm leading-none tracking-tight">{selectedModal.level} Care</h3>
                  <p className="text-white/85 font-semibold text-[14.5px] tracking-wide">{selectedModal.subtitle} Guidelines</p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-7 sm:p-8">
                <h4 className={`text-[12.5px] font-bold mb-5 uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recommended Actions
                </h4>
                
                <ul className="space-y-4 mb-8">
                  {selectedModal.tips && selectedModal.tips.map((tip, idx) => (
                    <li key={idx} className={`flex items-start gap-4 text-[14.5px] leading-relaxed font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      <div className={`mt-[6px] w-[6px] h-[6px] rounded-full flex-shrink-0 bg-gradient-to-r ${selectedModal.gradient} shadow-sm`} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>

                {selectedModal.escalation && (
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                    isDark ? 'bg-white/5 border-white/10 text-white/95' : 'bg-gray-50 border-gray-200/70 text-gray-900'
                  }`}>
                    <div className={`p-2.5 rounded-full flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]'}`}>
                      <AlertTriangle size={18} className={`opacity-90 ${isDark ? 'text-white' : 'text-[#f59e0b]'}`} />
                    </div>
                    <div className="pt-0.5">
                      <h5 className="font-bold text-[13.5px] mb-1.5 opacity-90 tracking-wide uppercase">When to Escalate</h5>
                      <span className={`text-[14px] leading-relaxed block font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {selectedModal.escalation}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-5 border-t border-gray-200/50 dark:border-white/5">
                  <button 
                    onClick={() => setSelectedModal(null)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all text-[14.5px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                      isDark 
                        ? 'bg-white text-gray-900 hover:bg-gray-100 border-transparent' 
                        : 'bg-gray-900 text-white hover:bg-gray-800 border-transparent'
                    }`}
                  >
                    Close Tips
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}
