import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, spotlight } from '../utils.jsx';
import { marquee, skills } from '../data.js';

function Marquee({ items, reverse }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee${reverse ? ' reverse' : ''}`}>
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="marquee-item">
            {t}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <SectionHeading
        eyebrow="Toolkit"
        lines={['Full-stack.', 'Production-grade.']}
        sub="Backend-first engineering with a sharp eye for the frontend — everything it takes to take a service from schema to production."
      />
      <div className="bento">
        {skills.map((s, i) => (
          <motion.div
            key={s.title}
            className={`bento-card${s.wide ? ' wide' : ''}${s.full ? ' full' : ''}`}
            onMouseMove={spotlight}
            data-cursor
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.08 }}
          >
            <div className="bento-top">
              <span className="bento-code">&lt;{s.code} /&gt;</span>
              <span className="bento-count">{String(s.items.length).padStart(2, '0')}</span>
            </div>
            <h3>{s.title}</h3>
            <p className="bento-desc">{s.desc}</p>
            <div className="chips">
              {s.items.map((it) => (
                <span key={it} className="chip">
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="marquees">
        <Marquee items={marquee} />
        <Marquee items={[...marquee].reverse()} reverse />
      </div>
    </section>
  );
}
