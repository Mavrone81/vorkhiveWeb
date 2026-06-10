import { useState, useRef, useEffect } from 'react';

// Floating sales/support chat widget for Vorkhive.
// Bot replies via POST /api/chat (Claude). "Talk to a human" hands off to the
// team via Slack (/api/handoff); their replies arrive by polling /api/poll.

const ACCENT = '#4f46e5';
const GREETING =
  "Hi! I'm Vorka, the Vorkhive HR assistant. Ask me about leave, claims, payroll, CPF compliance or pricing. 👋";
const QUICK_REPLIES = ['What is Vorkhive?', 'Does it handle CPF & payroll?', 'How much does it cost?', 'Talk to a human'];
const HUMAN_REPLY = 'Talk to a human';

function makeSid() {
  return 'sid_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('bot'); // 'bot' | 'human'
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Stable per-visitor session id (client only).
  const [sid] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      let s = window.localStorage.getItem('vh_chat_sid');
      if (!s) { s = makeSid(); window.localStorage.setItem('vh_chat_sid', s); }
      return s;
    } catch { return makeSid(); }
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Once a human is engaged, poll for their replies.
  useEffect(() => {
    if (mode !== 'human' || !sid) return undefined;
    let cursor = 0;
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/poll?sessionId=${encodeURIComponent(sid)}&cursor=${cursor}`);
        if (!r.ok) return;
        const j = await r.json();
        if (!alive) return;
        if (typeof j.cursor === 'number') cursor = j.cursor;
        if (Array.isArray(j.messages) && j.messages.length) {
          setMessages((prev) => [...prev, ...j.messages.map((m) => ({ role: 'agent', content: m.text }))]);
        }
      } catch { /* ignore transient poll errors */ }
    };
    const id = setInterval(tick, 3000);
    tick();
    return () => { alive = false; clearInterval(id); };
  }, [mode, sid]);

  async function handleHandoff() {
    if (busy || mode === 'human') return;
    const convo = messages.filter((m, i) => !(i === 0 && m.role === 'assistant'));
    setMessages((prev) => [...prev, { role: 'user', content: HUMAN_REPLY }, { role: 'assistant', content: '' }]);
    setBusy(true);
    try {
      const res = await fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, messages: convo }),
      });
      const j = await res.json().catch(() => ({}));
      const reply = j.ok
        ? "You're connected to the Vorkhive team — someone will reply right here shortly. Feel free to leave your email so we can follow up if you step away."
        : "You can reach the team directly: WhatsApp +65 8700 7621, call 8700 7621, or email samuel@vorkhive.com / enquires@vorkhive.com.";
      setMessages((prev) => { const n = prev.slice(); n[n.length - 1] = { role: 'assistant', content: reply }; return n; });
      if (j.ok) setMode('human');
    } catch {
      setMessages((prev) => { const n = prev.slice(); n[n.length - 1] = { role: 'assistant', content: 'You can reach the team on WhatsApp +65 8700 7621 or email enquires@vorkhive.com.' }; return n; });
    } finally {
      setBusy(false);
    }
  }

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput('');

    // Human mode: relay to the team (no bot reply); their answer arrives via polling.
    if (mode === 'human') {
      setMessages((prev) => [...prev, { role: 'user', content }]);
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid, messages: [{ role: 'user', content }] }),
        });
      } catch { /* delivered best-effort */ }
      return;
    }

    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sid,
          messages: history.filter((m, i) => !(i === 0 && m.role === 'assistant')),
        }),
      });
      if (!res.ok || !res.body) throw new Error('bad response');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => { const next = prev.slice(); next[next.length - 1] = { role: 'assistant', content: acc }; return next; });
      }
      if (!acc.trim()) throw new Error('empty');
    } catch {
      setMessages((prev) => {
        const next = prev.slice();
        next[next.length - 1] = { role: 'assistant', content: "Sorry, I'm having trouble right now. Please reach us at enquires@vorkhive.com or WhatsApp +65 8700 7621." };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  const lastIsTyping = busy && messages[messages.length - 1]?.role === 'assistant' && !messages[messages.length - 1].content;
  const subtitle = mode === 'human' ? 'Connected to the team' : 'Typically replies in a moment';

  return (
    <>
      <button
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: ACCENT, color: '#fff', boxShadow: '0 8px 24px rgba(79,70,229,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.15s ease',
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
          <div style={{ background: ACCENT, color: '#fff', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>V</div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Vorkhive Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{subtitle}</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Minimise chat" title="Minimise"
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                {m.role === 'agent' && <div style={{ fontSize: 11, color: '#64748b', margin: '0 0 3px 4px', fontWeight: 600 }}>Vorkhive team</div>}
                <div
                  style={{
                    padding: '10px 13px', borderRadius: 14, fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    background: m.role === 'user' ? ACCENT : (m.role === 'agent' ? '#ecfdf5' : '#fff'),
                    color: m.role === 'user' ? '#fff' : '#1e293b',
                    border: m.role === 'user' ? 'none' : (m.role === 'agent' ? '1px solid #a7f3d0' : '1px solid #e2e8f0'),
                    borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                    borderBottomLeftRadius: m.role === 'user' ? 14 : 4,
                  }}
                >
                  {m.content || (lastIsTyping && i === messages.length - 1 ? <TypingDots /> : '')}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => (q === HUMAN_REPLY ? handleHandoff() : send(q))} disabled={busy}
                    style={{ background: '#fff', border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 999, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #e2e8f0', background: '#fff' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'human' ? 'Message the team…' : 'Type your message...'}
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
