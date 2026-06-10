import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppRoutes from './AppRoutes.jsx';

export { defaultContent, mergeContent } from './content/defaults.js';

// Render a route to an HTML string for the given live content (SSR-on-request).
export function render(url, content) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes content={content} />
      </StaticRouter>
    </StrictMode>
  );
}
