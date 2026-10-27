import { motion } from 'framer-motion';
import { EASE } from '../utils.jsx';

const view = { once: true, margin: '-80px' };

/** lines: array of strings; the last line gets the gradient. */
export default function SectionHeading({ eyebrow, lines, sub, center = false }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`} >
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.8, ease: EASE }}>
        {eyebrow}
      </motion.p>
      <motion.h2 className="section-title" initial="hidden" whileInView="show" viewport={view}>
        {lines.map((line, i) => (
          <span className="line-mask" key={i}>
            <motion.span
              className={i === lines.length - 1 ? 'grad' : undefined}
              variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.08 * i }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {sub && (
        <motion.p className="section-sub" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}>
          {sub}
        </motion.p>
      )}
    </div>
  );
}
