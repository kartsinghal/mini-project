import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, RefreshCw, Lightbulb } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const RESPONSES = {
  fever: "A fever signals your immune system is working. Stay hydrated, rest, and consider paracetamol. If it exceeds 39.5°C or persists beyond 3 days — see a doctor.",
  cough: "Coughs often resolve within 1–2 weeks. Warm fluids, honey-ginger tea, and steam inhalation help. Persistent coughs (3+ weeks) or blood-tinged coughs need evaluation.",
  headache: "Most headaches are tension or dehydration-related. Rest in a quiet dark room, hydrate, and take OTC pain relief if needed. Sudden severe 'thunderclap' headaches need immediate attention.",
  stress: "Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Regular movement (even a 10-min walk) significantly reduces cortisol. Mindfulness and sleep hygiene are proven interventions.",
  stroke: "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 112/911. Every minute without treatment = ~1.9 million neurons lost. Act immediately.",
  default: "Thanks for sharing. I'm here to give you general advice, but for a deeper look, try the Symptom Checker above. Always check with a real doctor if you're worried!",
};

const QUICK = [
  "I have a high fever",
  "Managing stress & anxiety",
  "What is the FAST stroke test?",
  "Back pain for 3 days",
  "I have a persistent cough",
];

function getReply(text) {
  const t = text.toLowerCase();
  if (t.includes('fever') || t.includes('temperature')) return RESPONSES.fever;
  if (t.includes('cough') || t.includes('throat')) return RESPONSES.cough;
  if (t.includes('head') || t.includes('migraine')) return RESPONSES.headache;
  if (t.includes('stress') || t.includes('anxi') || t.includes('panic')) return RESPONSES.stress;
  if (t.includes('stroke') || t.includes('fast')) return RESPONSES.stroke;
  return RESPONSES.default;
}

// ── Streaming text hook ───────────────────────────────────────────────────────
function useStreamText(fullText, active) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!active || !fullText) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    // 12ms per char → feels fast but still visible
    const interval = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [fullText, active]);

  return displayed;
}

// Message component — handles streaming for assistant messages
function ChatMessage({ msg, isLatestAssistant, isDark, panelBorder, fmt }) {
  const streaming = isLatestAssistant;
  const streamed = useStreamText(msg.text, streaming);
  const text = streaming ? streamed : msg.text;

  // Show cursor blink while streaming
  const isComplete = streaming ? streamed.length >= msg.text.length : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      style={{
        display: 'flex',
        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
        alignItems: 'flex-end', gap: 8,
      }}
    >
      {/* Avatar dot */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: msg.role === 'assistant' ? 'var(--teal)' : isDark ? 'rgba(255,255,255,0.08)' : 'var(--light-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {msg.role === 'assistant'
          ? <Bot size={13} color="#fff" />
          : <User size={13} style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'var(--light-muted)' }} />
        }
      </div>

      <div style={{ maxWidth: '72%' }}>
        <div style={{
          padding: '11px 14px',
          borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          fontSize: 13.5, lineHeight: 1.6,
          background: msg.role === 'user'
            ? 'var(--teal)'
            : isDark ? 'rgba(255,255,255,0.06)' : 'var(--light-100)',
          color: msg.role === 'user' ? '#fff' : isDark ? 'rgba(255,255,255,0.75)' : 'var(--light-text)',
          border: msg.role !== 'user' ? `1px solid ${panelBorder}` : 'none',
          minHeight: '1em',
        }}>
          {text}
          {/* Blinking cursor while streaming */}
          {streaming && !isComplete && (
            <span style={{
              display: 'inline-block',
              width: 2, height: '1em',
              background: 'var(--teal-bright)',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'cursor-blink 0.7s ease-in-out infinite',
            }} />
          )}
        </div>
        <div style={{
          fontSize: 10.5, marginTop: 4,
          color: isDark ? 'rgba(255,255,255,0.2)' : '#c7c4be',
          textAlign: msg.role === 'user' ? 'right' : 'left',
        }}>{fmt(msg.time)}</div>
      </div>
    </motion.div>
  );
}

export default function AIChat() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: "Hi! I'm your HealthLens Advisor. You can ask me about symptoms, first aid, or general health tips. Just remember, I'm an AI, not a doctor—always check with a professional for real medical decisions.",
    time: new Date(),
    id: 0,
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [latestAssistantId, setLatestAssistantId] = useState(0);
  const chatContainerRef = useRef(null);
  const idRef = useRef(1);

  useEffect(() => { 
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const userMsg = { role: 'user', text: msg, time: new Date(), id: idRef.current++ };
    setMessages((p) => [...p, userMsg]);
    setTyping(true);

    // Simulate network delay (900–1600ms)
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    setTyping(false);

    const replyId = idRef.current++;
    const replyText = getReply(msg);
    setMessages((p) => [...p, { role: 'assistant', text: replyText, time: new Date(), id: replyId }]);
    setLatestAssistantId(replyId);
  };

  const reset = () => {
    const initId = idRef.current++;
    setMessages([{
      role: 'assistant',
      text: "Fresh start! What’s on your mind?",
      time: new Date(),
      id: initId,
    }]);
    setLatestAssistantId(initId);
  };

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const panelBg = isDark ? 'var(--dark-800)' : '#fff';
  const panelBorder = isDark ? 'var(--dark-border)' : 'var(--light-border)';

  return (
    <section
      id="advisor"
      style={{
        background: isDark ? 'var(--dark-900)' : 'var(--light-base)',
        padding: '100px var(--section-px)',
      }}
    >
      {/* Cursor blink keyframe */}
      <style>{`@keyframes cursor-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>

      <div style={{ maxWidth: 840, marginLeft: 0 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 40 }}
        >
          <span className="text-sm uppercase tracking-widest block mb-3 font-semibold" style={{ color: 'var(--teal-bright)' }}>
            AI Advisory
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
            style={{
              color: isDark ? '#fff' : 'var(--light-text)',
              fontFamily: "'Poppins', system-ui, sans-serif",
            }}
          >
            Chat with us
          </h2>
          <p className="body-sm" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)' }}>
            Here to help, but not a replacement for a real doctor.
          </p>
        </motion.div>

        {/* Chat panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            borderRadius: 20,
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
          }}
          className="glow-teal-sm"
          whileHover={{ boxShadow: '0 0 0 1px rgba(20,184,166,0.3), 0 8px 40px rgba(15,118,110,0.2)' }}
        >
          {/* Topbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'var(--light-100)',
            borderBottom: `1px solid ${panelBorder}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'var(--teal)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <Bot size={17} color="#fff" />
                <span style={{
                  position: 'absolute', bottom: -1, right: -1,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#22c55e',
                  border: `2px solid ${isDark ? 'var(--dark-800)' : '#fff'}`,
                }} />
              </div>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#fff' : 'var(--light-text)' }}>
                  HealthLens Advisor
                </span>
                <div style={{ fontSize: 11.5, color: '#22c55e', marginTop: 1 }}>
                  {typing ? '⚡ Thinking...' : '● Online'}
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--light-200)',
                color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(180deg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(0deg)'; }}
              title="Reset chat"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            style={{
            height: 360, overflowY: 'auto', padding: '20px 18px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  isLatestAssistant={msg.role === 'assistant' && msg.id === latestAssistantId}
                  isDark={isDark}
                  panelBorder={panelBorder}
                  fmt={fmt}
                />
              ))}
            </AnimatePresence>

            {/* Typing indicator — 3 bouncing dots */}
            <AnimatePresence>
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'var(--teal)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Bot size={13} color="#fff" />
                  </div>
                  <div style={{
                    padding: '12px 16px', borderRadius: '14px 14px 14px 4px',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'var(--light-100)',
                    border: `1px solid ${panelBorder}`,
                    display: 'flex', gap: 5, alignItems: 'center',
                  }}>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.14 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-bright)', display: 'inline-block' }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick prompts */}
          <div style={{
            padding: '10px 18px 6px',
            borderTop: `1px solid ${panelBorder}`,
            display: 'flex', gap: 6, overflowX: 'auto',
          }}>
            <Lightbulb size={12} style={{ color: 'var(--teal-bright)', marginRight: 2, flexShrink: 0, alignSelf: 'center' }} />
            {QUICK.map((q) => (
              <button
                key={q}
                onMouseDown={(e) => { e.preventDefault(); send(q); }}
                style={{
                  flexShrink: 0, padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 500,
                  border: `1px solid ${panelBorder}`,
                  background: 'transparent',
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'border-color 0.15s, color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--teal-bright)';
                  e.currentTarget.style.color = 'var(--teal-bright)';
                  e.currentTarget.style.background = isDark ? 'rgba(20,184,166,0.06)' : 'rgba(15,118,110,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = panelBorder;
                  e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.4)' : 'var(--light-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 18px 18px',
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about symptoms, advice, first aid..."
              className={isDark ? 'input-dark' : 'input-light'}
              style={{ flex: 1, padding: '10px 14px', fontSize: 13.5 }}
            />
            <motion.button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '10px 16px', fontSize: 14, opacity: (!input.trim() || typing) ? 0.45 : 1,
                cursor: (!input.trim() || typing) ? 'default' : 'pointer',
                flexShrink: 0,
              }}
            >
              <Send size={14} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
