import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { EASE } from '../utils.jsx';
import { devopsHighlights, pipeline } from '../data.js';

export default function DevOps() {
  const ref = useRef(null);
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.06], [0.2, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = (v - 0.05) / 0.85;
    setActive(t <= 0 ? -1 : Math.min(pipeline.length - 1, Math.floor(t * pipeline.length)));
  });

  const done = active === pipeline.length - 1;

  return (
    <section id="devops" ref={ref} className="devops">
      <div className="devops-sticky">
        <motion.div className="devops-head" style={{ opacity: headOpacity }}>
          <p className="eyebrow">DevOps & delivery</p>
          <h2 className="section-title">
            From commit <span className="grad">to production.</span>
          </h2>
        </motion.div>

        <div className="pipe">
          <div className="pipe-line">
            <motion.span style={{ scaleX: fill }} />
          </div>
          {pipeline.map((s, i) => {
            const state = i < active || (done && i === active) ? 'passed' : i === active ? 'running' : '';
            return (
              <div key={s.name} className={`pipe-stage ${state}`}>
                <div className="pipe-dot">
                  {state === 'passed' ? '✓' : s.icon}
                  {state === 'running' && <span className="pipe-ring" />}
                </div>
                <strong>{s.name}</strong>
                <span>{s.tool}</span>
              </div>
            );
          })}
        </div>

        <div className="devops-bottom">
          <div className="pipe-term">
            <div className="editor-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="editor-file">.gitlab-ci.yml — pipeline #4821</span>
              <span className={`pipe-status${done ? ' ok' : active >= 0 ? ' run' : ''}`}>{done ? 'passed' : active >= 0 ? 'running' : 'pending'}</span>
            </div>
            <div className="pipe-log">
              <AnimatePresence initial={false}>
                {pipeline.slice(0, active + 1).map((s, i) => (
                  <motion.p
                    key={s.name}
                    className={i === active && !done ? 'current' : ''}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span className="pipe-stage-tag">[{s.name.toLowerCase()}]</span> {s.log}
                  </motion.p>
                ))}
              </AnimatePresence>
              {active < 0 && <p className="pipe-wait">Scroll to run the pipeline…</p>}
            </div>
          </div>

          <div className="devops-metrics">
            {devopsHighlights.map((m) => (
              <div key={m.l}>
                <strong className="grad">{m.v}</strong>
                <span>{m.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
