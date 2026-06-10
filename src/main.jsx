import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';

const root = document.getElementById('root');
const lang = (typeof window !== 'undefined' && window.__LANG__) || 'en';
const basename = lang !== 'en' ? `/${lang}` : undefined;
const tree = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered routes ship real markup in #root -> hydrate it.
// A bare shell (no element child) -> client render from scratch.
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
