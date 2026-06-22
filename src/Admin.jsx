import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { defaultContent, mergeContent } from './content/defaults';

// ---- immutable helpers ----------------------------------------------------
function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? obj.slice() : { ...(obj || {}) };
  clone[head] = setIn(obj ? obj[head] : undefined, rest, value);
  return clone;
}
function getIn(obj, path) {
  return path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// ---- small field components -----------------------------------------------
const lbl = { display: 'block', fontSize: '.78rem', fontWeight: 600, color: '#475569', margin: '0 0 4px' };
const inp = { width: '100%', padding: '.55rem .7rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '.9rem', fontFamily: 'inherit' };

function Field({ label, value, onChange, area }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={lbl}>{label}</label>
      {area
        ? <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} />
        : <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} style={inp} />}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <details style={{ border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 12, background: '#fff' }}>
      <summary style={{ cursor: 'pointer', padding: '14px 16px', fontWeight: 700, fontFamily: 'Sora, sans-serif' }}>{title}</summary>
      <div style={{ padding: '4px 16px 18px' }}>{children}</div>
    </details>
  );
}

const btn = { padding: '.45rem .8rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '.82rem', fontWeight: 600 };
const itemBox = { border: '1px solid #eef0f4', borderRadius: 8, padding: 12, marginBottom: 10, background: '#fafbfc' };

function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tab, setTab] = useState('content');
  const [draft, setDraft] = useState(defaultContent);
  const [contacts, setContacts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const upd = (path, value) => setDraft((d) => setIn(d, path, value));
  const list = (path) => getIn(draft, path) || [];
  const addItem = (path, blank) => upd(path, [...list(path), blank]);
  const removeItem = (path, idx) => upd(path, list(path).filter((_, i) => i !== idx));

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const [cRes, kRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/contacts', { headers: { Authorization: `Bearer ${password}` } }),
      ]);
      if (kRes.status === 401) { setLoginError('Invalid access token'); return; }
      if (!kRes.ok) { setLoginError('Server error, try again'); return; }
      const overrides = cRes.ok ? await cRes.json() : {};
      setDraft(mergeContent(defaultContent, overrides || {}));
      setContacts(await kRes.json());
      setToken(password);
      setIsAuth(true);
    } catch {
      setLoginError('Could not reach the server');
    }
  }

  function handleLogout() {
    setIsAuth(false);
    setToken('');
    setPassword('');
    setDraft(defaultContent);
    setContacts([]);
    setTab('content');
    setSaveMsg('');
  }

  async function save() {
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      setSaveMsg(res.ok ? 'Saved ✓ — live on the site now' : 'Save failed');
    } catch {
      setSaveMsg('Save failed (network)');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 4000);
    }
  }

  async function uploadImage(file, path) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) { alert('Upload failed (png/jpg/webp/gif/svg, max 5MB)'); return; }
      const { url } = await res.json();
      upd(path, url);
    } catch {
      alert('Upload failed (network)');
    }
  }

  // ---- login screen -------------------------------------------------------
  if (!isAuth) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 16, boxShadow: '0 12px 40px rgba(15,23,42,.12)', width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <h2 style={{ marginBottom: '.4rem', fontFamily: 'Sora, sans-serif' }}>Vorkhive Admin</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '.9rem' }}>Enter the admin access token.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter access token" style={inp} required />
            {loginError && <p style={{ color: '#ef4444', fontSize: '.85rem', margin: 0 }}>{loginError}</p>}
            <button type="submit" style={{ ...btn, background: '#5B3DF5', color: '#fff', border: 'none', padding: '.7rem' }}>Login</button>
          </form>
          <div style={{ marginTop: '1.2rem' }}><Link to="/" style={{ fontSize: '.85rem', color: '#64748b' }}>← Back to site</Link></div>
        </div>
      </div>
    );
  }

  const TABS = [['content', 'Site content'], ['contacts', 'Contacts & branding'], ['leads', 'Leads'], ['demos', 'Demos'], ['analytics', 'Visitors'], ['usage', 'API usage']];

  return (
    <div style={{ background: '#F4F5FA', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 80 }}>
      {/* top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <strong style={{ fontFamily: 'Sora, sans-serif' }}>Vorkhive Admin</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ ...btn, background: tab === id ? '#5B3DF5' : '#fff', color: tab === id ? '#fff' : '#334155', border: tab === id ? 'none' : btn.border }}>{label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {saveMsg && <span style={{ fontSize: '.82rem', color: saveMsg.startsWith('Saved') ? '#16a34a' : '#ef4444' }}>{saveMsg}</span>}
          {!['leads', 'analytics', 'usage'].includes(tab) && <button onClick={save} disabled={saving} style={{ ...btn, background: '#16a34a', color: '#fff', border: 'none' }}>{saving ? 'Saving…' : 'Save changes'}</button>}
          <Link to="/" style={{ fontSize: '.82rem', color: '#64748b' }}>View site ↗</Link>
          <button onClick={handleLogout} style={{ ...btn, color: '#dc2626', borderColor: '#fecaca' }}>Log out</button>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '20px' }}>
        {tab === 'contacts' && (
          <>
            <Section title="Contact details (used by floating buttons + chat bot)">
              <Field label="Phone (tel: format, e.g. +6587007621)" value={getIn(draft, ['contact', 'phone'])} onChange={(v) => upd(['contact', 'phone'], v)} />
              <Field label="WhatsApp (digits only, e.g. 6587007621)" value={getIn(draft, ['contact', 'whatsapp'])} onChange={(v) => upd(['contact', 'whatsapp'], v)} />
              <Field label="Email 1" value={getIn(draft, ['contact', 'email1'])} onChange={(v) => upd(['contact', 'email1'], v)} />
              <Field label="Email 2 (optional, used as cc)" value={getIn(draft, ['contact', 'email2'])} onChange={(v) => upd(['contact', 'email2'], v)} />
            </Section>
            <Section title="Branding">
              <Field label="Brand name" value={getIn(draft, ['branding', 'brandName'])} onChange={(v) => upd(['branding', 'brandName'], v)} />
              <Field label="Brand tag (small text under logo)" value={getIn(draft, ['branding', 'brandTag'])} onChange={(v) => upd(['branding', 'brandTag'], v)} />
              <label style={lbl}>Logo image (replaces the “V” mark)</label>
              {getIn(draft, ['branding', 'logoImage']) && <img src={getIn(draft, ['branding', 'logoImage'])} alt="logo" style={{ height: 40, display: 'block', marginBottom: 8 }} />}
              <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], ['branding', 'logoImage'])} />
              {getIn(draft, ['branding', 'logoImage']) && <button style={{ ...btn, marginLeft: 8 }} onClick={() => upd(['branding', 'logoImage'], '')}>Remove (use “V”)</button>}
            </Section>
          </>
        )}

        {tab === 'content' && (
          <>
            <Section title="Hero">
              <Field label="Eyebrow" value={getIn(draft, ['hero', 'eyebrow'])} onChange={(v) => upd(['hero', 'eyebrow'], v)} />
              <Field label="Headline (lead)" value={getIn(draft, ['hero', 'headlineLead'])} onChange={(v) => upd(['hero', 'headlineLead'], v)} />
              <Field label="Headline (accent / coloured)" value={getIn(draft, ['hero', 'headlineAccent'])} onChange={(v) => upd(['hero', 'headlineAccent'], v)} />
              <Field label="Subtitle" area value={getIn(draft, ['hero', 'subtitle'])} onChange={(v) => upd(['hero', 'subtitle'], v)} />
              <Field label="Primary CTA label" value={getIn(draft, ['hero', 'ctaPrimary'])} onChange={(v) => upd(['hero', 'ctaPrimary'], v)} />
              <Field label="Secondary CTA label" value={getIn(draft, ['hero', 'ctaSecondary'])} onChange={(v) => upd(['hero', 'ctaSecondary'], v)} />
              <Field label="Trust line" value={getIn(draft, ['hero', 'trustLine'])} onChange={(v) => upd(['hero', 'trustLine'], v)} />
            </Section>

            <Section title="Customer logos strip">
              <Field label="Caption" value={getIn(draft, ['logos', 'caption'])} onChange={(v) => upd(['logos', 'caption'], v)} />
              {list(['logos', 'items']).map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input value={it} onChange={(e) => upd(['logos', 'items', i], e.target.value)} style={inp} />
                  <button style={btn} onClick={() => removeItem(['logos', 'items'], i)}>✕</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['logos', 'items'], 'New logo')}>+ Add logo</button>
            </Section>

            <Section title="Intro (“What is Vorkhive?”)">
              <Field label="Heading" value={getIn(draft, ['intro', 'heading'])} onChange={(v) => upd(['intro', 'heading'], v)} />
              <Field label="Paragraph 1" area value={getIn(draft, ['intro', 'body1'])} onChange={(v) => upd(['intro', 'body1'], v)} />
              <Field label="Paragraph 2" area value={getIn(draft, ['intro', 'body2'])} onChange={(v) => upd(['intro', 'body2'], v)} />
            </Section>

            <Section title="Problem section">
              <Field label="Eyebrow" value={getIn(draft, ['problem', 'eyebrow'])} onChange={(v) => upd(['problem', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['problem', 'heading'])} onChange={(v) => upd(['problem', 'heading'], v)} />
              <Field label="Subtext" area value={getIn(draft, ['problem', 'sub'])} onChange={(v) => upd(['problem', 'sub'], v)} />
              {list(['problem', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Icon (emoji)" value={it.icon} onChange={(v) => upd(['problem', 'items', i, 'icon'], v)} />
                  <Field label="Title" value={it.title} onChange={(v) => upd(['problem', 'items', i, 'title'], v)} />
                  <Field label="Text" area value={it.text} onChange={(v) => upd(['problem', 'items', i, 'text'], v)} />
                  <button style={btn} onClick={() => removeItem(['problem', 'items'], i)}>Remove card</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['problem', 'items'], { icon: '✨', title: 'New', text: '' })}>+ Add card</button>
            </Section>

            <Section title="Pillars (platform)">
              <Field label="Eyebrow" value={getIn(draft, ['pillars', 'eyebrow'])} onChange={(v) => upd(['pillars', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['pillars', 'heading'])} onChange={(v) => upd(['pillars', 'heading'], v)} />
              <Field label="Subtext" area value={getIn(draft, ['pillars', 'sub'])} onChange={(v) => upd(['pillars', 'sub'], v)} />
              {list(['pillars', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Tag" value={it.tag} onChange={(v) => upd(['pillars', 'items', i, 'tag'], v)} />
                  <Field label="Icon (emoji)" value={it.icon} onChange={(v) => upd(['pillars', 'items', i, 'icon'], v)} />
                  <Field label="Title" value={it.title} onChange={(v) => upd(['pillars', 'items', i, 'title'], v)} />
                  <Field label="Text" area value={it.text} onChange={(v) => upd(['pillars', 'items', i, 'text'], v)} />
                  <StringList label="Bullets" items={it.bullets || []} onChange={(arr) => upd(['pillars', 'items', i, 'bullets'], arr)} />
                  <Field label="Link label" value={it.moreLabel} onChange={(v) => upd(['pillars', 'items', i, 'moreLabel'], v)} />
                  <button style={btn} onClick={() => removeItem(['pillars', 'items'], i)}>Remove pillar</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['pillars', 'items'], { tag: '', icon: '✨', title: '', text: '', bullets: [], moreLabel: 'Learn more →' })}>+ Add pillar</button>
            </Section>

            <Section title="Feature splits">
              <Field label="Heading" value={getIn(draft, ['features', 'heading'])} onChange={(v) => upd(['features', 'heading'], v)} />
              {list(['features', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Eyebrow" value={it.eyebrow} onChange={(v) => upd(['features', 'items', i, 'eyebrow'], v)} />
                  <Field label="Title" value={it.title} onChange={(v) => upd(['features', 'items', i, 'title'], v)} />
                  <Field label="Text" area value={it.text} onChange={(v) => upd(['features', 'items', i, 'text'], v)} />
                  <StringList label="Bullets" items={it.bullets || []} onChange={(arr) => upd(['features', 'items', i, 'bullets'], arr)} />
                </div>
              ))}
            </Section>

            <Section title="Metrics">
              {list(['metrics']).map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input value={it.num} onChange={(e) => upd(['metrics', i, 'num'], e.target.value)} placeholder="40%" style={{ ...inp, maxWidth: 120 }} />
                  <input value={it.lab} onChange={(e) => upd(['metrics', i, 'lab'], e.target.value)} placeholder="Less HR admin" style={inp} />
                  <button style={btn} onClick={() => removeItem(['metrics'], i)}>✕</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['metrics'], { num: '', lab: '' })}>+ Add metric</button>
            </Section>

            <Section title="Steps">
              <Field label="Eyebrow" value={getIn(draft, ['steps', 'eyebrow'])} onChange={(v) => upd(['steps', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['steps', 'heading'])} onChange={(v) => upd(['steps', 'heading'], v)} />
              <Field label="Subtext" area value={getIn(draft, ['steps', 'sub'])} onChange={(v) => upd(['steps', 'sub'], v)} />
              {list(['steps', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Title" value={it.title} onChange={(v) => upd(['steps', 'items', i, 'title'], v)} />
                  <Field label="Text" area value={it.text} onChange={(v) => upd(['steps', 'items', i, 'text'], v)} />
                  <button style={btn} onClick={() => removeItem(['steps', 'items'], i)}>Remove step</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['steps', 'items'], { title: '', text: '' })}>+ Add step</button>
            </Section>

            <Section title="Testimonials">
              <Field label="Eyebrow" value={getIn(draft, ['testimonials', 'eyebrow'])} onChange={(v) => upd(['testimonials', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['testimonials', 'heading'])} onChange={(v) => upd(['testimonials', 'heading'], v)} />
              {list(['testimonials', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Quote" area value={it.quote} onChange={(v) => upd(['testimonials', 'items', i, 'quote'], v)} />
                  <Field label="Initials" value={it.initials} onChange={(v) => upd(['testimonials', 'items', i, 'initials'], v)} />
                  <Field label="Name" value={it.name} onChange={(v) => upd(['testimonials', 'items', i, 'name'], v)} />
                  <Field label="Role" value={it.role} onChange={(v) => upd(['testimonials', 'items', i, 'role'], v)} />
                  <button style={btn} onClick={() => removeItem(['testimonials', 'items'], i)}>Remove</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['testimonials', 'items'], { quote: '', initials: '', name: '', role: '' })}>+ Add testimonial</button>
            </Section>

            <Section title="Pricing">
              <Field label="Eyebrow" value={getIn(draft, ['pricing', 'eyebrow'])} onChange={(v) => upd(['pricing', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['pricing', 'heading'])} onChange={(v) => upd(['pricing', 'heading'], v)} />
              <Field label="Subtext" area value={getIn(draft, ['pricing', 'sub'])} onChange={(v) => upd(['pricing', 'sub'], v)} />
              {list(['pricing', 'plans']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Name" value={it.name} onChange={(v) => upd(['pricing', 'plans', i, 'name'], v)} />
                  <Field label="Description" value={it.desc} onChange={(v) => upd(['pricing', 'plans', i, 'desc'], v)} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Field label="Price" value={it.price} onChange={(v) => upd(['pricing', 'plans', i, 'price'], v)} />
                    <Field label="Period" value={it.period} onChange={(v) => upd(['pricing', 'plans', i, 'period'], v)} />
                  </div>
                  <Field label="Badge (optional)" value={it.badge} onChange={(v) => upd(['pricing', 'plans', i, 'badge'], v)} />
                  <Field label="CTA label" value={it.cta} onChange={(v) => upd(['pricing', 'plans', i, 'cta'], v)} />
                  <label style={{ ...lbl, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="checkbox" checked={!!it.featured} onChange={(e) => upd(['pricing', 'plans', i, 'featured'], e.target.checked)} /> Featured (highlighted) plan
                  </label>
                  <StringList label="Features" items={it.bullets || []} onChange={(arr) => upd(['pricing', 'plans', i, 'bullets'], arr)} />
                  <button style={btn} onClick={() => removeItem(['pricing', 'plans'], i)}>Remove plan</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['pricing', 'plans'], { name: '', desc: '', price: 'S$0', period: ' /user / mo', featured: false, badge: '', bullets: [], cta: 'Start free' })}>+ Add plan</button>
            </Section>

            <Section title="FAQ">
              <Field label="Eyebrow" value={getIn(draft, ['faq', 'eyebrow'])} onChange={(v) => upd(['faq', 'eyebrow'], v)} />
              <Field label="Heading" value={getIn(draft, ['faq', 'heading'])} onChange={(v) => upd(['faq', 'heading'], v)} />
              <Field label="Subtext" value={getIn(draft, ['faq', 'sub'])} onChange={(v) => upd(['faq', 'sub'], v)} />
              {list(['faq', 'items']).map((it, i) => (
                <div key={i} style={itemBox}>
                  <Field label="Question" value={it.q} onChange={(v) => upd(['faq', 'items', i, 'q'], v)} />
                  <Field label="Answer" area value={it.a} onChange={(v) => upd(['faq', 'items', i, 'a'], v)} />
                  <button style={btn} onClick={() => removeItem(['faq', 'items'], i)}>Remove Q&amp;A</button>
                </div>
              ))}
              <button style={btn} onClick={() => addItem(['faq', 'items'], { q: '', a: '' })}>+ Add Q&amp;A</button>
            </Section>

            <Section title="Final call-to-action">
              <Field label="Heading" value={getIn(draft, ['finalCta', 'heading'])} onChange={(v) => upd(['finalCta', 'heading'], v)} />
              <Field label="Subtext" area value={getIn(draft, ['finalCta', 'sub'])} onChange={(v) => upd(['finalCta', 'sub'], v)} />
              <Field label="Primary CTA" value={getIn(draft, ['finalCta', 'ctaPrimary'])} onChange={(v) => upd(['finalCta', 'ctaPrimary'], v)} />
              <Field label="Secondary CTA" value={getIn(draft, ['finalCta', 'ctaSecondary'])} onChange={(v) => upd(['finalCta', 'ctaSecondary'], v)} />
              <Field label="Trust line" value={getIn(draft, ['finalCta', 'trustLine'])} onChange={(v) => upd(['finalCta', 'trustLine'], v)} />
            </Section>

            <Section title="Footer">
              <Field label="Brand text" area value={getIn(draft, ['footer', 'brandText'])} onChange={(v) => upd(['footer', 'brandText'], v)} />
              <Field label="Copyright" value={getIn(draft, ['footer', 'copyright'])} onChange={(v) => upd(['footer', 'copyright'], v)} />
              <Field label="Legal line" value={getIn(draft, ['footer', 'legal'])} onChange={(v) => upd(['footer', 'legal'], v)} />
            </Section>
          </>
        )}

        {tab === 'leads' && <Leads contacts={contacts} />}
        {tab === 'demos' && <Demos token={token} />}
        {tab === 'analytics' && <Analytics token={token} />}
        {tab === 'usage' && <Usage token={token} />}
      </div>
    </div>
  );
}

function Analytics({ token }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [days, setDays] = useState(30);
  const [showBots, setShowBots] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/analytics?days=${days}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((d) => { if (alive) { setData(d); setErr(''); } })
      .catch(() => { if (alive) setErr('Could not load analytics.'); });
    return () => { alive = false; };
  }, [token, days]);

  const num = (n) => (n || 0).toLocaleString('en-US');
  const when = (ts) => new Date(ts).toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' });
  const countryFlag = (cc) => (/^[A-Za-z]{2}$/.test(cc) ? cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0))) : '');

  const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' };
  const th = { padding: '9px 12px', fontWeight: 600 };
  const td = { padding: '9px 12px', borderBottom: '1px solid #eef0f4' };
  const panel = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: 8 };
  const head = { fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '.95rem', margin: '0 0 8px' };
  const btn = { padding: '7px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '.82rem', background: '#fff', cursor: 'pointer' };

  // ── PDF export (lazy-loaded so it never affects the SSR build) ─────────────
  const exportPDF = async () => {
    if (!data) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const s = data.summary, b = data.bots, e = data.engagement;
      doc.setFontSize(16); doc.setTextColor('#0B0A1A'); doc.text('Vorkhive — Visitor & SEO Report', 40, 46);
      doc.setFontSize(10); doc.setTextColor(100);
      doc.text(`Last ${data.days} days · generated ${new Date().toLocaleString('en-SG')}`, 40, 62);
      doc.text(`Real visitors: ${s.uniqueIPs}   Page views: ${s.pageviews}   New: ${e.newVisitors}   Returning: ${e.returningVisitors}   Avg pages/visitor: ${e.avgViews}`, 40, 80, { maxWidth: W - 80 });
      doc.text(`Bots/scanners filtered out: ${b.visitors} sources, ${b.events} hits`, 40, 95, { maxWidth: W - 80 });
      let y = 116;
      const add = (title, h, rows) => {
        if (!rows || !rows.length) return;
        if (y > 760) { doc.addPage(); y = 50; }
        doc.setFontSize(11); doc.setTextColor('#0B0A1A'); doc.text(title, 40, y); y += 6;
        autoTable(doc, { startY: y, head: [h], body: rows, theme: 'striped', headStyles: { fillColor: [91, 61, 245], fontSize: 8 }, styles: { fontSize: 8, cellPadding: 3, overflow: 'ellipsize' }, margin: { left: 40, right: 40 } });
        y = doc.lastAutoTable.finalY + 16;
      };
      add('Top pages', ['Page', 'Views'], data.topPages.map((p) => [p.k, num(p.count)]));
      add('Landing pages (first page seen)', ['Entry page', 'Sessions'], data.entryPages.map((p) => [p.k, num(p.count)]));
      add('Traffic sources (referrers)', ['Referrer', 'Hits'], data.topReferrers.map((p) => [p.k, num(p.count)]));
      add('Countries', ['Country', 'Visitors'], data.byCountry.map((p) => [p.k, num(p.count)]));
      add('Devices', ['Device', 'Visitors'], data.byDevice.map((p) => [p.k, num(p.count)]));
      add('Browsers', ['Browser', 'Visitors'], data.byBrowser.map((p) => [p.k, num(p.count)]));
      add('Operating systems', ['OS', 'Visitors'], data.byOS.map((p) => [p.k, num(p.count)]));
      add('Languages', ['Language', 'Events'], data.byLang.map((p) => [p.k, num(p.count)]));
      add('Most clicked elements', ['Element', 'Clicks'], data.topClicks.map((p) => [p.k, num(p.count)]));
      add('Real visitors', ['IP', 'Location', 'Last seen', 'Last page', 'Views', 'Device'],
        data.visitors.filter((v) => !v.bot).map((v) => [v.ip, v.geo ? v.geo.location : (v.private ? 'Local' : '—'), when(v.lastTs), v.lastPath || '—', num(v.views), `${v.dev.browser} · ${v.dev.os}`]));
      doc.save(`vorkhive-visitors-${data.days}d-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (ex) {
      alert('PDF export failed: ' + (ex && ex.message ? ex.message : ex));
    } finally { setExporting(false); }
  };

  // ── small presentational helpers ──────────────────────────────────────────
  const BarList = ({ rows, fmt, suffix }) => {
    const max = Math.max(1, ...rows.map((r) => r.count));
    if (!rows.length) return <div style={{ padding: 14, color: '#94a3b8', fontSize: '.82rem' }}>No data yet.</div>;
    return rows.map((r) => (
      <div key={r.k} style={{ padding: '7px 12px', borderBottom: '1px solid #eef0f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', marginBottom: 4, gap: 8 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.k}>{fmt ? fmt(r.k) : r.k}</span>
          <strong>{num(r.count)}{suffix || ''}</strong>
        </div>
        <div style={{ height: 5, background: '#eef0f4', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(r.count / max) * 100}%`, background: '#5B3DF5' }} />
        </div>
      </div>
    ));
  };
  const Panel = ({ title, hint, children }) => (
    <div>
      <h3 style={{ ...head, marginTop: 18 }}>{title}{hint && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '.74rem', marginLeft: 6 }}>{hint}</span>}</h3>
      <div style={panel}>{children}</div>
    </div>
  );

  if (err) return <div style={{ color: '#dc2626' }}>{err}</div>;
  if (!data) return <div style={{ color: '#64748b' }}>Loading…</div>;

  const s = data.summary, b = data.bots, e = data.engagement, t = data.trend || [];
  const cards = [
    ['Page views', s.pageviews], ['Real unique visitors', s.uniqueIPs],
    ['Returning', e.returningVisitors], ['Avg pages / visitor', e.avgViews],
    ['Chat opened', s.chatOpens], ['WhatsApp clicks', s.whatsapp],
    ['Email clicks', s.email], ['Element clicks', s.clicks],
  ];
  const trendMax = Math.max(1, ...t.map((r) => r.views));
  const rows = (data.visitors || []).filter((v) => showBots || !v.bot);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 14px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '.85rem', color: '#334155', margin: 0, fontWeight: 600 }}>First-party visitor & SEO analytics</p>
          <p style={{ fontSize: '.76rem', color: '#94a3b8', margin: '2px 0 0' }}>
            Bots, scanners and datacenter traffic are filtered out — numbers below reflect real people.
            <strong style={{ color: '#b45309' }}> {num(b.visitors)} bot/scanner source{b.visitors === 1 ? '' : 's'} ({num(b.events)} hits) excluded.</strong>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <select value={days} onChange={(ev) => setDays(Number(ev.target.value))} style={{ ...btn, cursor: 'pointer' }}>
            {[1, 7, 30, 90, 365].map((d) => <option key={d} value={d}>Last {d} day{d > 1 ? 's' : ''}</option>)}
          </select>
          <button onClick={exportPDF} disabled={exporting} style={{ ...btn, background: '#5B3DF5', color: '#fff', border: 'none', fontWeight: 600 }}>
            {exporting ? 'Generating…' : '⬇ Export PDF'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {cards.map(([label, val]) => (
          <div key={label} style={card}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Sora, sans-serif', color: '#0B0A1A' }}>{num(val)}</div>
            <div style={{ fontSize: '.78rem', color: '#64748b' }}>{label}</div>
          </div>
        ))}
      </div>

      <Panel title="Traffic trend" hint="real page views per day">
        <div style={{ padding: '14px 14px 8px' }}>
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: 96, display: 'block' }}>
            {t.map((r, i) => {
              const w = 100 / Math.max(t.length, 1);
              const h = (r.views / trendMax) * 28;
              return <rect key={r.day} x={i * w + 0.3} y={30 - h} width={Math.max(w - 0.6, 0.4)} height={h} fill="#5B3DF5" rx="0.4"><title>{`${r.day}: ${r.views} views · ${r.visitors} visitors`}</title></rect>;
            })}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.68rem', color: '#94a3b8', marginTop: 4 }}>
            <span>{t[0] && t[0].day}</span><span>{t[t.length - 1] && t[t.length - 1].day}</span>
          </div>
        </div>
      </Panel>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 4 }}>
        <Panel title="Top pages" hint="SEO content performance"><BarList rows={data.topPages} /></Panel>
        <Panel title="Landing pages" hint="where sessions start"><BarList rows={data.entryPages} /></Panel>
        <Panel title="Traffic sources" hint="external referrers"><BarList rows={data.topReferrers} /></Panel>
        <Panel title="Countries"><BarList rows={data.byCountry} /></Panel>
        <Panel title="Devices" hint="mobile-first matters for SEO"><BarList rows={data.byDevice} /></Panel>
        <Panel title="Browsers"><BarList rows={data.byBrowser} /></Panel>
        <Panel title="Operating systems"><BarList rows={data.byOS} /></Panel>
        <Panel title="Languages" hint="i18n interest"><BarList rows={data.byLang} fmt={(k) => ({ en: 'English', zh: '中文', ms: 'Bahasa Melayu', ta: 'தமிழ்', th: 'ไทย' }[k] || k)} /></Panel>
        <Panel title="Most clicked elements"><BarList rows={data.topClicks} /></Panel>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22 }}>
        <h3 style={{ ...head, margin: 0 }}>Visitors</h3>
        <label style={{ fontSize: '.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
          <input type="checkbox" checked={showBots} onChange={(ev) => setShowBots(ev.target.checked)} /> show bots / scanners
        </label>
      </div>
      <p style={{ fontSize: '.76rem', color: '#94a3b8', margin: '0 0 8px' }}>
        Location is derived from the IP address (city-level, approximate). Rows flagged <span style={{ color: '#b45309' }}>BOT</span> are excluded from the metrics above.
      </p>
      <div style={panel}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '.84rem' }}>
          <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['IP address', 'Approx. location', 'Last seen', 'Last page', 'Views', 'Device'].map((h) => <th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 26, textAlign: 'center', color: '#94a3b8' }}>No visitors recorded yet.</td></tr>
            ) : rows.map((v) => {
              const g = v.geo;
              const loc = v.private ? 'Local / private network' : (g && g.location ? g.location : 'Locating…');
              const flag = g && g.countryCode ? countryFlag(g.countryCode) : '';
              const map = g && g.lat != null ? `https://www.google.com/maps?q=${g.lat},${g.lon}` : null;
              return (
                <tr key={v.ip} style={v.bot ? { background: '#fffbeb' } : undefined}>
                  <td style={{ ...td, fontFamily: 'monospace' }}>
                    {v.ip}
                    {v.bot && <span title={v.botReason} style={{ marginLeft: 6, fontSize: '.6rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 4, padding: '1px 4px' }}>BOT</span>}
                  </td>
                  <td style={td}>
                    {flag && <span style={{ marginRight: 5 }}>{flag}</span>}
                    {map ? <a href={map} target="_blank" rel="noopener noreferrer" style={{ color: '#5B3DF5' }}>{loc}</a> : <span style={{ color: g || v.private ? 'inherit' : '#94a3b8' }}>{loc}</span>}
                    {g && g.postal ? <span style={{ color: '#94a3b8' }}> · {g.postal}</span> : null}
                  </td>
                  <td style={td}>{when(v.lastTs)}</td>
                  <td style={td}>{v.lastPath || '—'}</td>
                  <td style={td}>{num(v.views)}</td>
                  <td style={{ ...td, color: '#64748b' }}>{v.dev ? `${v.dev.browser} · ${v.dev.os}` : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Usage({ token }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    fetch('/api/usage', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then(setData)
      .catch(() => setErr('Could not load usage.'));
  }, [token]);

  const cost = (c) => '$' + (c < 0.01 ? c.toFixed(4) : c.toFixed(2));
  const num = (n) => (n || 0).toLocaleString('en-US');

  if (err) return <div style={{ color: '#dc2626' }}>{err}</div>;
  if (!data) return <div style={{ color: '#64748b' }}>Loading…</div>;

  return (
    <div>
      <p style={{ fontSize: '.85rem', color: '#64748b', margin: '0 0 12px' }}>
        Chat bot usage on the Claude API (model: <code>{data.model}</code>, ${data.prices?.input}/1M in · ${data.prices?.output}/1M out).
        Estimated — the Anthropic Console is the source of truth for billing.
      </p>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Month', 'Messages', 'Input tokens', 'Output tokens', 'Est. cost'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>No usage recorded yet.</td></tr>
            ) : data.rows.map((r) => (
              <tr key={r.month} style={{ borderBottom: '1px solid #eef0f4' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.month}</td>
                <td style={{ padding: '10px 14px' }}>{num(r.messages)}</td>
                <td style={{ padding: '10px 14px' }}>{num(r.inputTokens)}</td>
                <td style={{ padding: '10px 14px' }}>{num(r.outputTokens)}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{cost(r.estCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DEMO_PERIODS = [
  { id: 1, label: '8:00 AM – 10:00 AM' },
  { id: 2, label: '11:00 AM – 1:00 PM' },
  { id: 3, label: '2:00 PM – 4:00 PM' },
  { id: 4, label: '5:00 PM – 7:00 PM' },
  { id: 5, label: '8:00 PM – 10:00 PM' },
];

function Demos({ token }) {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState('');
  const [edit, setEdit] = useState({});

  const load = () => fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
    .then(setList)
    .catch(() => setErr('Could not load bookings.'));
  useEffect(() => { load(); }, [token]);

  async function act(id, action) {
    setBusy(id + action); setErr('');
    const e = edit[id];
    const body = action === 'confirm' ? JSON.stringify(e || {}) : undefined;
    try {
      const res = await fetch(`/api/bookings/${id}/${action}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Action failed.');
      if (action === 'confirm' && j.invited === false) setErr(j.error || 'Confirmed, but the invite email failed to send.');
      await load();
    } catch (e2) { setErr(e2.message); } finally { setBusy(''); }
  }

  const badge = (s) => ({ pending: ['#92400e', '#fef3c7'], confirmed: ['#166534', '#dcfce7'], declined: ['#991b1b', '#fee2e2'] }[s] || ['#475569', '#f1f5f9']);

  if (err && !list) return <div style={{ color: '#dc2626' }}>{err}</div>;
  if (!list) return <div style={{ color: '#64748b' }}>Loading…</div>;

  return (
    <div>
      {err && <p style={{ color: '#dc2626', fontSize: '.9rem' }}>{err}</p>}
      <p style={{ fontSize: '.85rem', color: '#64748b', margin: '0 0 12px' }}>
        Demo requests. <strong>Confirm</strong> emails the visitor a calendar invite (Singapore time) and blocks that slot; <strong>Decline</strong> frees it. {list.length} total.
      </p>
      {list.length === 0 ? (
        <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>No demo bookings yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map((b) => {
            const [fg, bg] = badge(b.status);
            const e = edit[b.id] || { date: b.date, period: b.period };
            return (
              <div key={b.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{b.name}{b.company && <span style={{ color: '#64748b', fontWeight: 400 }}> · {b.company}</span>}</div>
                    <div style={{ fontSize: '.85rem', color: '#475569' }}>{b.email}{b.phone && ` · ${b.phone}`}</div>
                    <div style={{ fontSize: '.9rem', marginTop: 4 }}>📅 <strong>{b.date}</strong> · {b.periodLabel}</div>
                    {b.notes && <div style={{ fontSize: '.85rem', color: '#64748b', marginTop: 4 }}>“{b.notes}”</div>}
                  </div>
                  <span style={{ alignSelf: 'flex-start', background: bg, color: fg, padding: '3px 10px', borderRadius: 999, fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{b.status}{b.invited ? ' · invited' : ''}</span>
                </div>
                {b.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 12, paddingTop: 12, borderTop: '1px solid #eef0f4' }}>
                    <span style={{ fontSize: '.8rem', color: '#64748b' }}>Confirm for:</span>
                    <input type="date" value={e.date} onChange={(ev) => setEdit({ ...edit, [b.id]: { ...e, date: ev.target.value } })} style={{ ...inp, width: 'auto', padding: '6px 8px' }} />
                    <select value={e.period} onChange={(ev) => setEdit({ ...edit, [b.id]: { ...e, period: Number(ev.target.value) } })} style={{ ...inp, width: 'auto', padding: '6px 8px' }}>
                      {DEMO_PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <button type="button" disabled={!!busy} onClick={() => act(b.id, 'confirm')} style={{ ...btn, background: '#4f46e5', color: '#fff', border: 'none' }}>{busy === b.id + 'confirm' ? 'Sending…' : 'Confirm & send invite'}</button>
                    <button type="button" disabled={!!busy} onClick={() => act(b.id, 'decline')} style={btn}>Decline</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Editable list of plain strings (bullets, features, logos).
function StringList({ label, items, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={lbl}>{label}</label>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} style={inp} />
          <button type="button" style={btn} onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <button type="button" style={btn} onClick={() => onChange([...items, ''])}>+ Add</button>
    </div>
  );
}

function Leads({ contacts }) {
  const fmt = (s) => { try { return new Date(s).toLocaleString('en-SG'); } catch { return s; } };
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '.88rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Date', 'Name', 'Email', 'Company', 'Size', 'Message'].map((h) => <th key={h} style={{ padding: '10px 14px', fontWeight: 600 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>No leads yet.</td></tr>
            ) : contacts.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eef0f4' }}>
                <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: '#64748b' }}>{fmt(c.timestamp)}</td>
                <td style={{ padding: '10px 14px' }}>{c.name}</td>
                <td style={{ padding: '10px 14px' }}><a href={`mailto:${c.email}`} style={{ color: '#5B3DF5' }}>{c.email}</a></td>
                <td style={{ padding: '10px 14px' }}>{c.company}</td>
                <td style={{ padding: '10px 14px' }}>{c.employees || 'N/A'}</td>
                <td style={{ padding: '10px 14px', maxWidth: 280 }}>{c.message || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
