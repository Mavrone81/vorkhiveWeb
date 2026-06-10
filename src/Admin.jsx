import { useState } from 'react';
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

  const TABS = [['content', 'Site content'], ['contacts', 'Contacts & branding'], ['leads', 'Leads']];

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
          {tab !== 'leads' && <button onClick={save} disabled={saving} style={{ ...btn, background: '#16a34a', color: '#fff', border: 'none' }}>{saving ? 'Saving…' : 'Save changes'}</button>}
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
      </div>
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
