import { useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { renderTokens, tokenizeJS } from '../utils.jsx';

const CODE = `import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auth } from './middleware/jwt.js';
import { cache } from './lib/redis.js';

const app = express();
app.use(helmet(), express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// Real-time analytics, cached in Redis
app.get('/api/v1/analytics', auth, cache(60),
  async (req, res, next) => {
    try {
      const data = await Report.aggregate(pipeline);
      res.json({ ok: true, data });
    } catch (err) { next(err); }
  });

app.listen(3000);`;

const features = [
  { title: 'Secure by default', text: 'JWT · OAuth2 · RBAC · Helmet · CORS', at: 0.42 },
  { title: 'Fast under load', text: 'Redis caching · indexed aggregations', at: 0.58 },
  { title: 'Documented & tested', text: 'Swagger/OpenAPI · Jest · CI gates', at: 0.74 },
];

function Feature({ f, progress }) {
  const opacity = useTransform(progress, [f.at, f.at + 0.08], [0, 1]);
  const y = useTransform(progress, [f.at, f.at + 0.08], [24, 0]);
  return (
    <motion.div className="laptop-feature" style={{ opacity, y }}>
      <strong>{f.title}</strong>
      <span>{f.text}</span>
    </motion.div>
  );
}

export default function Laptop() {
  const ref = useRef(null);
  const tokens = useMemo(() => tokenizeJS(CODE), []);
  const [count, setCount] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const headOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const headY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);
  const lid = useTransform(scrollYProgress, [0.02, 0.32], [-92, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.32, 0.9, 1], [0.72, 1, 1, 0.94]);
  const glow = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.3) / 0.52));
    setCount(Math.round(t * CODE.length));
  });

  const done = count >= CODE.length;

  return (
    <section id="craft" ref={ref} className="laptop-section">
      <div className="laptop-sticky">
        <motion.div className="laptop-head" style={{ opacity: headOpacity, y: headY }}>
          <p className="eyebrow">The craft</p>
          <h2 className="section-title">
            Engineered for <span className="grad">production.</span>
          </h2>
        </motion.div>

        <motion.div className="laptop" style={{ scale }}>
          <motion.div className="laptop-glow" style={{ opacity: glow }} />
          <motion.div className="lid" style={{ rotateX: lid }}>
            <div className="screen">
              <div className="editor-bar">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="editor-file">server.js — analytics-api</span>
              </div>
              <pre className="code">
                {renderTokens(tokens, count)}
                {!done && <span className="caret" />}
              </pre>
              <div className={`term${done ? ' on' : ''}`}>
                <span className="t-ok">✓</span> Server listening on <b>:3000</b>
                <span className="term-meta">· 0 vulnerabilities · tests passed</span>
              </div>
            </div>
          </motion.div>
          <div className="base">
            <div className="notch" />
          </div>
        </motion.div>

        <div className="laptop-features">
          {features.map((f) => (
            <Feature key={f.title} f={f} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
