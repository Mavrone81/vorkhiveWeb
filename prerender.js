// Build-time static prerender (SSG): render each route to HTML and inject it
// into the built dist/index.html template. Run after `vite build` (client) and
// `vite build --ssr` (server bundle). No headless browser required.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const abs = (p) => path.join(__dirname, p);

const template = fs.readFileSync(abs('dist/index.html'), 'utf-8');
const { render } = await import(abs('dist-ssr/entry-server.js'));

// route -> output file under dist/
const routes = {
  '/': 'index.html',
  '/contact': 'contact/index.html',
  '/admin': 'admin/index.html',
  '/success': 'success/index.html',
};

for (const [url, out] of Object.entries(routes)) {
  const appHtml = render(url);
  const html = template.replace('<!--app-html-->', appHtml);
  const outPath = abs(path.join('dist', out));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log('prerendered', url, '->', out, `(${appHtml.length} chars)`);
}
