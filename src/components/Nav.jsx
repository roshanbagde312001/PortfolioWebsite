import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { scrollToId } from '../utils.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const links = [
  ['skills', 'Skills'],
  ['system-design', 'System'],
  ['networking', 'Network'],
  ['devops', 'DevOps'],
  ['observability', 'APM'],
  ['experience', 'Experience'],
  ['projects', 'Work'],
  ['playground', 'API'],
  ['contact', 'Contact'],
];

export default function Nav({ onOpenPalette }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400);
    setScrolled(v > 40);
  });

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <motion.header
      className={`nav${scrolled ? ' scrolled' : ''}`}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button className="nav-logo" onClick={() => scrollToId('home')} aria-label="Back to top">
        <span className="logo-mark notranslate" translate="no">RB</span>
        <span className="logo-text">Roshan Bagde</span>
      </button>
      <nav className="nav-links">
        {links.map(([id, label]) => (
          <button key={id} onClick={() => scrollToId(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="nav-right">
        <LanguageSwitcher />
      <button className="nav-k" onClick={onOpenPalette} aria-label="Open command menu">
        <span className="nav-k-desktop">
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
          <kbd>K</kbd>
        </span>
        <span className="nav-k-mobile">Menu</span>
      </button>
      </div>
    </motion.header>
  );
}
