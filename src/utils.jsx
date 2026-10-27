import { useEffect, useState } from 'react';

export const EASE = [0.16, 1, 0.3, 1];

/** Mouse-follow spotlight for cards (sets --mx / --my). */
export function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/** True while the viewport is phone-sized. */
export function useIsMobile(query = '(max-width: 760px)') {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Reveal `total` characters over `duration` ms; restarts whenever `key` changes. */
/* Re-renders when the page switches into / out of machine translation. */
export function useTranslated() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setOn(html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl'));
    check();
    const mo = new MutationObserver(check);
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  return on;
}

export function useTypewriter(total, duration, key) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let start;
    let frame;
    setShown(0);
    const step = (t) => {
      start ??= t;
      const n = Math.min(total, Math.round(((t - start) / duration) * total));
      setShown(n);
      if (n < total) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [total, duration, key]);
  return shown;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function toast(message) {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: message }));
}

export async function copyText(text, message = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    toast(text);
  }
}

function tokenize(src, re, classify) {
  const tokens = [];
  let last = 0;
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) tokens.push({ text: src.slice(last, m.index), cls: '' });
    tokens.push(...classify(m));
    last = re.lastIndex;
  }
  if (last < src.length) tokens.push({ text: src.slice(last), cls: '' });
  return tokens;
}

const JS_RE = /('[^']*'|`[^`]*`)|(\/\/.*)|\b(import|from|const|let|async|await|try|catch|new|return|class|extends|static|this|if|else|throw|export|function|get)\b|\b(\d[\d_]*)\b|([A-Za-z_$][\w$]*)(?=\s*\()|([{}()[\]])/g;

export function tokenizeJS(src) {
  return tokenize(src, JS_RE, (m) => {
    const cls = m[1] ? 't-str' : m[2] ? 't-com' : m[3] ? 't-kw' : m[4] ? 't-num' : m[5] ? 't-fn' : 't-pun';
    return [{ text: m[0], cls }];
  });
}

const JSON_RE = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;

export function tokenizeJSON(src) {
  return tokenize(src, JSON_RE, (m) => {
    if (m[1] && m[2]) return [{ text: m[1], cls: 't-key' }, { text: m[2], cls: '' }];
    if (m[1]) return [{ text: m[1], cls: 't-str' }];
    if (m[3]) return [{ text: m[3], cls: 't-kw' }];
    return [{ text: m[0], cls: 't-num' }];
  });
}

/** Render the first `count` characters of a token list as highlighted spans. */
export function renderTokens(tokens, count = Infinity) {
  let remaining = count;
  const out = [];
  for (let i = 0; i < tokens.length && remaining > 0; i++) {
    const t = tokens[i];
    out.push(
      <span key={i} className={t.cls}>
        {t.text.slice(0, remaining)}
      </span>
    );
    remaining -= t.text.length;
  }
  return out;
}

/** Wrap metrics such as 25%, 100+, 100K+ in <strong>. */
export function highlightMetrics(text) {
  return text.split(/(\b\d+(?:K\+|\+|%))/g).map((part, i) =>
    i % 2 ? <strong key={i}>{part}</strong> : part
  );
}
