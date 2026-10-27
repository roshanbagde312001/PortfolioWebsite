import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Lenis from 'lenis';

import Loader from './components/Loader.jsx';
import Cursor from './components/Cursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import TextReveal from './components/TextReveal.jsx';
import Laptop from './components/Laptop.jsx';
import Stats from './components/Stats.jsx';
import Exploded from './components/Exploded.jsx';
import Skills from './components/Skills.jsx';
import SystemDesign from './components/SystemDesign.jsx';
import Networking from './components/Networking.jsx';
import Patterns from './components/Patterns.jsx';
import Algorithms from './components/Algorithms.jsx';
import DevOps from './components/DevOps.jsx';
import Observability from './components/Observability.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Playground from './components/Playground.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Toast from './components/Toast.jsx';
import VoiceIntro from './components/VoiceIntro.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Smooth scrolling
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Freeze the page while the intro or the palette is on screen
  useEffect(() => {
    const locked = loading || paletteOpen;
    document.documentElement.classList.toggle('is-locked', locked);
    if (locked) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [loading, paletteOpen]);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" onDone={() => setLoading(false)} />}</AnimatePresence>
      <Cursor />
      <ScrollProgress />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <main>
        <Hero ready={!loading} />
        <TextReveal />
        <Laptop />
        <Stats />
        <Exploded />
        <Skills />
        <SystemDesign />
        <Networking />
        <Patterns />
        <Algorithms />
        <DevOps />
        <Observability />
        <Experience />
        <Projects />
        <Playground />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <VoiceIntro hidden={loading || paletteOpen} />
      <Toast />
    </MotionConfig>
  );
}
