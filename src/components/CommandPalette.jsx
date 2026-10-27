import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { copyText, scrollToId } from '../utils.jsx';
import { profile } from '../data.js';
import { playIntro } from './VoiceIntro.jsx';

const open = (url) => window.open(url, '_blank', 'noopener');

const commands = [
  { group: 'Navigate', label: 'Home', icon: '⌂', run: () => scrollToId('home') },
  { group: 'Navigate', label: 'About me', icon: '◎', run: () => scrollToId('about') },
  { group: 'Navigate', label: 'The craft', icon: '⌘', run: () => scrollToId('craft') },
  { group: 'Navigate', label: 'Under the hood', icon: '◫', run: () => scrollToId('under-the-hood') },
  { group: 'Navigate', label: 'Skills', icon: '✦', run: () => scrollToId('skills') },
  { group: 'Navigate', label: 'System design', icon: '⧉', run: () => scrollToId('system-design') },
  { group: 'Navigate', label: 'Networking', icon: '⇆', run: () => scrollToId('networking') },
  { group: 'Navigate', label: 'OSI model (exploded)', icon: '◫', run: () => scrollToId('osi') },
  { group: 'Navigate', label: 'Design patterns', icon: '◇', run: () => scrollToId('patterns') },
  { group: 'Navigate', label: 'Algorithms & DSA', icon: '∑', run: () => scrollToId('algorithms') },
  { group: 'Navigate', label: 'DevOps pipeline', icon: '⚙', run: () => scrollToId('devops') },
  { group: 'Navigate', label: 'Monitoring & APM', icon: '◉', run: () => scrollToId('observability') },
  { group: 'Navigate', label: 'Experience', icon: '◷', run: () => scrollToId('experience') },
  { group: 'Navigate', label: 'Projects', icon: '▣', run: () => scrollToId('projects') },
  { group: 'Navigate', label: 'API playground', icon: '{}', run: () => scrollToId('playground') },
  { group: 'Navigate', label: 'Contact', icon: '✉', run: () => scrollToId('contact') },
  { group: 'Actions', label: 'Hear my intro (voice, ~60 sec)', icon: '♪', run: playIntro },
  { group: 'Actions', label: 'Translate / change language', icon: '⊕', run: () => window.dispatchEvent(new Event('app:lang')) },
  { group: 'Actions', label: 'Copy email address', icon: '⧉', run: () => copyText(profile.email, 'Email copied to clipboard') },
  { group: 'Actions', label: 'Send an email', icon: '→', run: () => (window.location.href = `mailto:${profile.email}`) },
  { group: 'Actions', label: 'Download résumé', icon: '↓', run: () => { const a = document.createElement('a'); a.href = profile.resume; a.download = ''; a.click(); } },
  { group: 'Links', label: 'GitHub — Roshan-Bagde', icon: '⌥', run: () => open(profile.github) },
  { group: 'Links', label: 'LinkedIn — roshan-bagde', icon: 'in', run: () => open(profile.linkedin) },
];

export default function CommandPalette({ open: isOpen, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(s)) : commands;
  }, [q]);

  useEffect(() => {
    if (isOpen) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  useEffect(() => setActive(0), [q]);

  const run = (cmd) => {
    onClose();
    setTimeout(cmd.run, 60);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter' && results[active]) run(results[active]);
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="palette-overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Command menu"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKey}
            initial={{ opacity: 0, scale: 0.94, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="palette-input">
              <span>⌕</span>
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command or search…" />
              <kbd>esc</kbd>
            </div>
            <div className="palette-list" data-lenis-prevent>
              {results.length === 0 && <p className="palette-empty">No results for “{q}”</p>}
              {results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <div key={c.label}>
                    {header && <p className="palette-group">{header}</p>}
                    <button className={`palette-item${i === active ? ' active' : ''}`} onMouseMove={() => setActive(i)} onClick={() => run(c)}>
                      <span className="palette-icon">{c.icon}</span>
                      {c.label}
                      {i === active && <span className="palette-enter">↵</span>}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="palette-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
