import { createContext, useContext, useState } from 'react';
import { defaultContent } from './defaults';

const ContentContext = createContext(defaultContent);

function resolveInitial(initial) {
  if (initial) return initial;
  // On the client, the server injects the live (merged) content as window.__CONTENT__
  // so the first render matches the server-rendered HTML (clean hydration, no flash).
  if (typeof window !== 'undefined' && window.__CONTENT__) return window.__CONTENT__;
  return defaultContent;
}

export function ContentProvider({ children, initial }) {
  const [content] = useState(() => resolveInitial(initial));
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
