import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppRoutes from './AppRoutes.jsx';

export { defaultContent, mergeContent } from './content/defaults.js';
export { translations } from './content/i18n/index.js';

// Render a route to an HTML string for the given live content (SSR-on-request).
// `lang` sets the router basename so /zh, /ms, /ta, /th resolve their routes.
export function render(url, content, lang) {
  const basename = lang && lang !== 'en' ? `/${lang}` : undefined;
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={basename}>
        <AppRoutes content={content} />
      </StaticRouter>
    </StrictMode>
  );
}
