import { useState, useEffect } from 'react';
import { MarketingShell, Check } from './Shell.jsx';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function BookDemo() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState(null);
  const [date, setDate] = useState('');
  const [periods, setPeriods] = useState([]);
  const [period, setPeriod] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', notes: '' });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const now = new Date();
    setView({ y: now.getFullYear(), m: now.getMonth() });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setPeriod(null);
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((j) => setPeriods(j.periods || []))
      .catch(() => setPeriods([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const todayStr = mounted ? ymd(new Date()) : '';
  const maxDate = mounted ? (() => { const d = new Date(); d.setDate(d.getDate() + 90); return ymd(d); })() : '';

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!date || !period) { setErr('Please choose a date and time slot.'); return; }
    if (!form.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) { setErr('Please enter your name and a valid email.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, date, period }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Could not book that slot.');
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
      fetch(`/api/slots?date=${date}`).then((r) => r.json()).then((j) => setPeriods(j.periods || [])).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  }

  function calendar() {
    if (!view) return null;
    const startDow = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    const canPrev = `${view.y}-${pad(view.m + 1)}` > todayStr.slice(0, 7);
    return (
      <div className="cal">
        <div className="cal-head">
          <button type="button" disabled={!canPrev} onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))} aria-label="Previous month">‹</button>
          <strong>{MONTHS[view.m]} {view.y}</strong>
          <button type="button" onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))} aria-label="Next month">›</button>
        </div>
        <div className="cal-grid">
          {WEEKDAYS.map((w) => <span key={w} className="cal-dow">{w}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const ds = `${view.y}-${pad(view.m + 1)}-${pad(d)}`;
            const disabled = ds < todayStr || ds > maxDate;
            return <button type="button" key={ds} disabled={disabled} onClick={() => { setDate(ds); setErr(''); }} className={`cal-day${date === ds ? ' sel' : ''}`}>{d}</button>;
          })}
        </div>
      </div>
    );
  }

  return (
    <MarketingShell>
      <section className="article book">
        <p className="eyebrow">Book a demo</p>
        <h1>Book your Vorkhive demo</h1>
        <p className="lede">Pick a date and a time that suits you — we'll confirm by email with a calendar invite. All times are Singapore time (SGT).</p>

        {!mounted ? (
          <p className="book-hint">Loading the calendar…</p>
        ) : done ? (
          <div className="book-done">
            <div className="bd-check"><Check s={26} sw={3} /></div>
            <h2>Request received 🎉</h2>
            <p>Thanks {form.name.split(' ')[0]}! We've got your demo request for <strong>{date}</strong>, <strong>{periods.find((p) => p.id === period)?.label}</strong> (SGT). We'll email <strong>{form.email}</strong> to confirm with a calendar invite.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="book-grid">
            <div>
              <h3 className="book-step">1 · Choose a date</h3>
              {calendar()}
              <h3 className="book-step">2 · Choose a time {date && <span className="book-date">— {date}</span>}</h3>
              {!date ? <p className="book-hint">Select a date first.</p> : loadingSlots ? <p className="book-hint">Checking availability…</p> : (
                <div className="slots">
                  {periods.map((p) => (
                    <button type="button" key={p.id} disabled={!p.available} className={`slot${period === p.id ? ' sel' : ''}${!p.available ? ' taken' : ''}`} onClick={() => setPeriod(p.id)}>
                      <span>{p.label}</span>{!p.available && <span className="slot-x">Booked</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="book-step">3 · Your details</h3>
              <div className="book-fields">
                <input placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Work email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <textarea placeholder="Anything you'd like us to cover? (optional)" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              {err && <p className="book-err">{err}</p>}
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>{submitting ? 'Booking…' : 'Request demo'}</button>
              <p className="book-fine">No charge. We'll confirm by email with a calendar invite.</p>
            </div>
          </form>
        )}
      </section>
    </MarketingShell>
  );
}
