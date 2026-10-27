import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE, scrollToId } from '../utils.jsx';
import { introScript } from '../data.js';

const RATES = [1, 1.25, 1.5];
const WPM = 165; // used to estimate caption timing when the browser gives no word events

const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/* Prefer an Indian-English voice, then a natural-sounding English one */
function pickVoice() {
  const voices = window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
  const by = (test) => voices.find(test);
  return (
    by((v) => /en[-_]IN/i.test(v.lang) && /male|rishi|ravi|prabhat/i.test(v.name)) ||
    by((v) => /en[-_]IN/i.test(v.lang)) ||
    by((v) => /Google UK English Male|Daniel|Natural/i.test(v.name)) ||
    by((v) => /Google/i.test(v.name)) ||
    voices[0] ||
    null
  );
}

/** Open the spoken intro from anywhere (button, ⌘K, hero CTA). */
export function playIntro() {
  window.dispatchEvent(new Event('app:intro'));
}

export function Bars({ on, n = 4 }) {
  return (
    <span className={`vi-bars${on ? ' on' : ''}`} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ animationDelay: `${i * 0.13}s` }} />
      ))}
    </span>
  );
}

export default function VoiceIntro({ hidden }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | playing | paused | done
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [rate, setRate] = useState(1);
  const [follow, setFollow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const run = useRef(0); // invalidates callbacks from cancelled utterances
  const timer = useRef(null);
  const state = useRef({ rate, follow });
  state.current = { rate, follow };

  const clearTimer = () => {
    clearInterval(timer.current);
    timer.current = null;
  };

  const stopAudio = useCallback(() => {
    run.current++;
    clearTimer();
    if (canSpeak()) window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (i) => {
      stopAudio();
      if (i >= introScript.length) {
        setStatus('done');
        setChars(introScript[introScript.length - 1].text.length);
        return;
      }
      const id = run.current;
      const { text, section } = introScript[i];
      const r = state.current.rate;
      setIdx(i);
      setChars(0);
      setStatus('playing');
      if (state.current.follow) scrollToId(section);

      const next = () => {
        if (run.current === id) speak(i + 1);
      };

      // Estimated caption progress — replaced by real word boundaries when the browser sends them
      let boundary = false;
      const started = performance.now();
      const msPerChar = 60000 / (WPM * r) / 5.6;
      timer.current = setInterval(() => {
        if (boundary || run.current !== id) return;
        const c = Math.min(text.length, Math.round((performance.now() - started) / msPerChar));
        setChars(c);
        if (!canSpeak() && c >= text.length) next();
      }, 60);

      if (!canSpeak()) return;
      const u = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      }
      u.rate = r;
      u.pitch = 1;
      u.onboundary = (e) => {
        if (run.current !== id || e.name === 'sentence') return;
        boundary = true;
        const rest = text.slice(e.charIndex);
        const len = e.charLength || (rest.match(/^\S+/)?.[0].length ?? 0);
        setChars(e.charIndex + len);
      };
      u.onend = () => {
        if (run.current !== id) return;
        setChars(text.length);
        setTimeout(next, 260);
      };
      u.onerror = (e) => {
        if (run.current !== id || e.error === 'interrupted' || e.error === 'canceled') return;
        // Speech failed (no voices, blocked…) — keep the captions going on their own
        clearTimer();
        const t0 = performance.now();
        timer.current = setInterval(() => {
          const c = Math.min(text.length, Math.round((performance.now() - t0) / msPerChar));
          setChars(c);
          if (c >= text.length) next();
        }, 60);
      };
      window.speechSynthesis.speak(u);
    },
    [stopAudio]
  );

  // Open + start from anywhere. Runs inside the click handler so mobile Safari allows speech.
  useEffect(() => {
    const onIntro = () => {
      setOpen(true);
      speak(0);
    };
    window.addEventListener('app:intro', onIntro);
    return () => window.removeEventListener('app:intro', onIntro);
  }, [speak]);

  // Voices load asynchronously in Chrome
  useEffect(() => {
    if (!canSpeak()) return;
    window.speechSynthesis.getVoices();
    const noop = () => {};
    window.speechSynthesis.addEventListener?.('voiceschanged', noop);
    const stop = () => window.speechSynthesis.cancel();
    window.addEventListener('pagehide', stop);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', noop);
      window.removeEventListener('pagehide', stop);
      stop();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes the player
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // pause = cancel; resume restarts the current sentence (speechSynthesis.pause is unreliable in Chrome)
  const toggle = () => {
    if (status === 'playing') {
      stopAudio();
      setStatus('paused');
    } else if (status === 'done') speak(0);
    else speak(idx);
  };
  const close = () => {
    stopAudio();
    setOpen(false);
    setStatus('idle');
  };
  const cycleRate = () => {
    const r = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    state.current.rate = r;
    setRate(r);
    if (status === 'playing') speak(idx);
  };

  const line = introScript[idx];
  const words = line.text.split(/(\s+)/);
  let pos = 0;
  const playing = status === 'playing';

  return (
    <>
      <AnimatePresence>
        {!open && !hidden && scrolled && (
          <motion.button
            key="launcher"
            className="vi-launch"
            onClick={playIntro}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.5, ease: EASE }}
            aria-label="Hear a one-minute spoken introduction"
            data-cursor
          >
            <span className="vi-launch-orb">
              <Bars on n={3} />
            </span>
            <span className="vi-launch-text">
              Hear my intro
              <small>~60 sec</small>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="player"
            className="vi"
            role="dialog"
            aria-label="Spoken introduction"
            initial={{ opacity: 0, y: 40, scale: 0.94, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.94, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="vi-head">
              <div className={`vi-orb${playing ? ' on' : ''}`}>
                <span className="vi-orb-ring" />
                <span className="vi-orb-ring two" />
                <b>RB</b>
              </div>
              <div className="vi-title">
                <span>Roshan, in 60 seconds</span>
                <small>
                  <Bars on={playing} n={5} />
                  {playing ? `Speaking · ${line.chapter}` : status === 'paused' ? 'Paused' : status === 'done' ? 'Finished' : 'Ready'}
                </small>
              </div>
              <button className="vi-x" onClick={close} aria-label="Close intro">
                ✕
              </button>
            </div>

            <div className="vi-chapters" aria-hidden="true">
              {introScript.map((c, i) => (
                <button key={c.text} className={i < idx || status === 'done' ? 'done' : i === idx ? 'on' : ''} onClick={() => speak(i)} title={c.chapter} tabIndex={-1}>
                  <span style={{ transform: `scaleX(${i < idx || status === 'done' ? 1 : i === idx ? chars / line.text.length : 0})` }} />
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                className="vi-caption"
                aria-live="polite"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {words.map((w, i) => {
                  const start = pos;
                  pos += w.length;
                  return /\s/.test(w) ? (
                    w
                  ) : (
                    <span key={i} className={start < chars ? 'lit' : ''}>
                      {w}
                    </span>
                  );
                })}
              </motion.p>
            </AnimatePresence>

            <div className="vi-controls">
              <button className="vi-btn" onClick={() => speak(Math.max(0, idx - 1))} aria-label="Previous" disabled={idx === 0}>
                ⏮
              </button>
              <button className="vi-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : status === 'done' ? (
                  '↻'
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                )}
              </button>
              <button className="vi-btn" onClick={() => speak(idx + 1)} aria-label="Next" disabled={status === 'done'}>
                ⏭
              </button>
              <span className="vi-spacer" />
              <button className="vi-chip" onClick={cycleRate} aria-label="Playback speed">
                {rate}×
              </button>
              <button
                className={`vi-chip${follow ? ' on' : ''}`}
                onClick={() => {
                  setFollow((f) => !f);
                  if (!follow) scrollToId(line.section);
                }}
                aria-pressed={follow}
                title="Scroll the page along with the intro"
              >
                Tour {follow ? 'on' : 'off'}
              </button>
            </div>
            <p className="vi-note">{canSpeak() ? 'Synthesized voice · live captions' : 'Voice not supported in this browser — captions only'}</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
