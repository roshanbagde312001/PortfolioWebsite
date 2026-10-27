import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE } from '../utils.jsx';
import { stats } from '../data.js';

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 2.2, ease: EASE, onUpdate: setV });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="stat-value grad">
      {prefix}
      {Math.round(v)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="section stats">
      <SectionHeading eyebrow="Impact" lines={['Numbers that', 'speak for themselves.']} center />
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.1 }}
          >
            <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
            <p>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
