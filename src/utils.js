export const createPageUrl = (page) => {
    if (page.toLowerCase() === 'home') return '/';
    return '/' + page.toLowerCase();
};

// First-party analytics: beacon an interaction event to the server.
// Never throws — analytics must not break the page. No-ops during SSR.
export function track(type, meta = {}) {
    if (typeof window === 'undefined') return;
    try {
        const body = JSON.stringify({
            type,
            path: window.location ? window.location.pathname : '',
            lang: window.__LANG__ || 'en',
            ...meta,
        });
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
        } else {
            fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
        }
    } catch { /* ignore */ }
}
