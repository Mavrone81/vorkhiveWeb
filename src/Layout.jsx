import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import FloatingContacts from './components/FloatingContacts';
import { track } from './utils.js';

// Build a short, human-readable label for a clicked element so the admin can see
// "what parts of the website" people click. Prefers an explicit data-track tag,
// then the nearest link/button, then the enclosing section id.
function labelForClick(start) {
  const tagged = start.closest('[data-track]');
  if (tagged) return tagged.getAttribute('data-track').slice(0, 80);
  const ctl = start.closest('a, button, [role="button"]');
  if (ctl) {
    const text = (ctl.getAttribute('aria-label') || ctl.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    if (ctl.tagName === 'A') {
      const href = ctl.getAttribute('href') || '';
      return `link: ${text || href}${href ? ` → ${href}` : ''}`.slice(0, 120);
    }
    return `button: ${text}`.slice(0, 80);
  }
  const sec = start.closest('section[id], [data-section], [id]');
  if (sec && (sec.id || sec.getAttribute('data-section'))) {
    return `section: ${sec.id || sec.getAttribute('data-section')}`.slice(0, 80);
  }
  return '';
}

// The homepage (App.jsx) ships its own header/footer (SG-HRMS redesign).
// Layout renders the routed page and mounts the floating widgets on every page.
export default function Layout({ children }) {
  const location = useLocation();
  const firstView = useRef(true);

  // SPA navigations after the initial (server-recorded) load.
  useEffect(() => {
    if (firstView.current) { firstView.current = false; return; }
    track('pageview', { path: location.pathname });
  }, [location.pathname]);

  // Delegated click tracking — captures which parts of the page get clicked.
  // The floating contacts / chat widget emit their own dedicated events, so
  // skip clicks inside them here (data-no-track) to avoid double counting.
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-no-track]')) return;
      const label = labelForClick(t);
      if (label) track('click', { label });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <>
      {children}
      <FloatingContacts />
      <ChatWidget />
    </>
  );
}
