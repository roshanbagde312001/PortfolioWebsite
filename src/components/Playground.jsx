import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, renderTokens, tokenizeJSON } from '../utils.jsx';
import { endpoints } from '../data.js';

const LIMIT = 5;
const WINDOW_MS = 10_000;
const STATUS_TEXT = { 200: 'OK', 201: 'Created', 429: 'Too Many Requests' };

export default function Playground() {
  const [sel, setSel] = useState(0);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(0);
  const hits = useRef([]);
  const cache = useRef(new Set());

  const tokens = useMemo(() => (res ? tokenizeJSON(res.json) : []), [res]);

  useEffect(() => {
    if (!res) return;
    const total = res.json.length;
    let start;
    let frame;
    const step = (t) => {
      start ??= t;
      const n = Math.min(total, Math.round(((t - start) / 650) * total));
      setShown(n);
      if (n < total) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [res]);

  const send = () => {
    if (loading) return;
    const ep = endpoints[sel];
    const now = Date.now();
    hits.current = hits.current.filter((t) => now - t < WINDOW_MS);
    hits.current.push(now);
    const limited = hits.current.length > LIMIT;
    const cached = !limited && ep.method === 'GET' && cache.current.has(ep.path);
    const latency = limited ? 2 : cached ? 3 + Math.round(Math.random() * 6) : 42 + Math.round(Math.random() * 70);

    setLoading(true);
    setRes(null);
    setShown(0);
    setTimeout(() => {
      if (!limited && ep.method === 'GET') cache.current.add(ep.path);
      const status = limited ? 429 : ep.status || 200;
      const body = limited
        ? { error: 'Too Many Requests', message: 'Rate limit hit — yes, I build these too. Try again in a few seconds.', retryAfter: 10 }
        : ep.body;
      setRes({ status, latency, cached, remaining: Math.max(0, LIMIT - hits.current.length), json: JSON.stringify(body, null, 2), method: ep.method });
      setLoading(false);
    }, latency + 280);
  };

  const ep = endpoints[sel];

  return (
    <section id="playground" className="section playground">
      <SectionHeading
        eyebrow="API playground"
        lines={['Don’t just read it.', 'Call it.']}
        sub="A tiny, live-feeling API about me — with Redis-style caching and a real rate limiter. Try spamming Send."
        center
      />

      <motion.div
        className="pg"
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <aside className="pg-side">
          <p className="pg-label">Endpoints</p>
          {endpoints.map((e, i) => (
            <button key={e.path} className={`pg-ep${i === sel ? ' active' : ''}`} onClick={() => setSel(i)}>
              <span className={`method m-${e.method.toLowerCase()}`}>{e.method}</span>
              <span className="pg-ep-text">
                <code>{e.path}</code>
                <small>{e.desc}</small>
              </span>
            </button>
          ))}
        </aside>

        <div className="pg-main">
          <div className="pg-bar">
            <span className={`method m-${ep.method.toLowerCase()}`}>{ep.method}</span>
            <code className="pg-url">
              <span className="pg-host">localhost:3000</span>
              {ep.path}
            </code>
            <button className="pg-send" onClick={send} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send'}
            </button>
          </div>

          <div className="pg-res">
            <AnimatePresence mode="wait">
              {!res && !loading && (
                <motion.div key="empty" className="pg-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="pg-empty-icon">{'{ }'}</span>
                  Pick an endpoint and hit <b>Send</b>.
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" className="pg-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="spinner big" />
                  Awaiting response…
                </motion.div>
              )}
              {res && (
                <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="pg-meta">
                    <span className={`status s-${String(res.status)[0]}`}>
                      {res.status} {STATUS_TEXT[res.status]}
                    </span>
                    <span>{res.latency} ms</span>
                    {res.method === 'GET' && res.status !== 429 && <span className={res.cached ? 'hit' : ''}>x-cache: {res.cached ? 'HIT' : 'MISS'}</span>}
                    <span>x-ratelimit-remaining: {res.remaining}</span>
                  </div>
                  <pre className="pg-json">{renderTokens(tokens, shown)}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
