import { useState, useRef, useEffect } from 'react';

// Floating sales/support chat widget for Vorkhive.
// Talks to POST /api/chat (server.js -> Ollama), streaming the reply token by token.

const ACCENT = '#4f46e5';
const GREETING =
  "Hi! I'm Vorka, the Vorkhive HR assistant. Ask me about leave, claims, payroll, CPF compliance or pricing. 👋";
const QUICK_REPLIES = ['What is Vorkhive?', 'Does it handle CPF & payroll?', 'How much does it cost?', 'Talk to a human'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput('');
    const history = [...messages, { role: 'user', content }];
    // Add an empty assistant message we stream into.
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Drop the greeting; send only the real conversation.
        body: JSON.stringify({ messages: history.filter((m, i) => !(i === 0 && m.role === 'assistant')) }),
      });
      if (!res.ok || !res.body) throw new Error('bad response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      // Stream chunks into the last (assistant) message.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { role: 'assistant', content: acc };
          return next;
        });
      }
      if (!acc.trim()) throw new Error('empty');
    } catch {
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble right now. Please reach us at enquires@vorkhive.com or WhatsApp +65 8886 6506.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  const lastIsTyping = busy && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1].content;

  return (
    <>
      {/* Launcher bubble */}
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: ACCENT, color: '#fff', boxShadow: '0 8px 24px rgba(79,70,229,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-8.9 8.4 9 9 0 0 1-4.1-1L3 21l1.1-4.5A8.38 8.38 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z" /></svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 96, right: 24, zIndex: 9999,
            width: 'min(380px, calc(100vw - 32px))', height: 'min(560px, calc(100vh - 140px))',
            background: '#fff', borderRadius: 16, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 12px 48px rgba(15,23,42,0.28)', fontFamily: 'inherit',
            border: '1px solid rgba(15,23,42,0.08)',
          }}
        >
          {/* Header */}
          <div style={{ background: ACCENT, color: '#fff', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>V</div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Vorkhive Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>Typically replies in a moment</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Minimise chat"
              title="Minimise"
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* chevron-down = minimise back to the bubble */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                <div
                  style={{
                    padding: '10px 13px', borderRadius: 14, fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    background: m.role === 'user' ? ACCENT : '#fff',
                    color: m.role === 'user' ? '#fff' : '#1e293b',
                    border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                    borderBottomLeftRadius: m.role === 'user' ? 14 : 4,
                  }}
                >
                  {m.content || (lastIsTyping && i === messages.length - 1 ? <TypingDots /> : '')}
                </div>
              </div>
            ))}

            {/* Quick replies (only before the user has said anything) */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => send(q)} disabled={busy}
                    style={{ background: '#fff', border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 999, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0', background: '#fff' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 999, padding: '10px 14px', fontSize: 14, outline: 'none' }}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send"
              style={{ background: ACCENT, border: 'none', borderRadius: '50%', width: 40, height: 40, minWidth: 40, color: '#fff', cursor: busy || !input.trim() ? 'default' : 'pointer', opacity: busy || !input.trim() ? 0.55 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, padding: '2px 0' }}>
      <Dot d={0} /><Dot d={0.2} /><Dot d={0.4} />
      <style>{`@keyframes vk-bounce{0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-4px);opacity:1}}`}</style>
    </span>
  );
}
function Dot({ d }) {
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `vk-bounce 1.2s ${d}s infinite ease-in-out` }} />;
}
