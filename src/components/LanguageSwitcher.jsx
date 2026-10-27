import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, toast } from '../utils.jsx';
import { LANGUAGES, restoreLanguage, setLanguage } from '../translate.js';

function Globe() {
  return (
    <svg viewBox="0 0 24 24" className="lang-globe" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef(null);
  const input = useRef(null);

  useEffect(() => setLang(restoreLanguage()), []);

  // Opened from the ⌘K menu
  useEffect(() => {
    const onOpen = () => setTimeout(() => setOpen(true), 80);
    window.addEventListener('app:lang', onOpen);
    return () => window.removeEventListener('app:lang', onOpen);
  }, []);

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    if (window.matchMedia('(hover: hover)').matches) setTimeout(() => input.current?.focus(), 60);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? LANGUAGES.filter((l) => l.name.toLowerCase().includes(s) || l.native.toLowerCase().includes(s) || l.code.toLowerCase().startsWith(s)) : LANGUAGES;
  }, [q]);

  const choose = async (l) => {
    setOpen(false);
    setQ('');
    if (l.code === lang) return;
    setLang(l.code);
    setBusy(true);
    try {
      await setLanguage(l.code);
      toast(l.code === 'en' ? 'Showing the original English' : `Translated to ${l.name}`);
    } catch {
      setLang('en');
      toast('Translation is unavailable right now — check your connection');
    } finally {
      setBusy(false);
    }
  };

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="lang notranslate" ref={ref} translate="no">
      <button className={`lang-btn${lang !== 'en' ? ' on' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={`Language: ${current.name}. Change language`}>
        {busy ? <span className="lang-spin" /> : <Globe />}
        <span className="lang-code">{lang === 'zh-CN' ? 'ZH' : lang.toUpperCase()}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="lang-pop"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            data-lenis-prevent
          >
            <div className="lang-head">
              <span>Translate this site</span>
              <small>Auto-translated · original is English</small>
            </div>
            <input ref={input} className="lang-search" placeholder="Search language…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search languages" />
            <ul role="listbox" aria-label="Languages">
              {list.map((l) => (
                <li key={l.code}>
                  <button role="option" aria-selected={l.code === lang} className={l.code === lang ? 'on' : ''} onClick={() => choose(l)}>
                    <b lang={l.code}>{l.native}</b>
                    <span>{l.name}</span>
                    {l.code === lang && <i>✓</i>}
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="lang-empty">No match</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
