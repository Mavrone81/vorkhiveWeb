import { createContext, useContext, useEffect, useState } from 'react';
import { defaultContent, mergeContent } from './defaults';

const ContentContext = createContext(defaultContent);

export function ContentProvider({ children }) {
  // Start from defaults so the prerendered HTML and first client render match
  // (no hydration mismatch). Apply saved overrides after mount.
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    let alive = true;
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : null))
      .then((overrides) => {
        if (alive && overrides && typeof overrides === 'object') {
          setContent(mergeContent(defaultContent, overrides));
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
