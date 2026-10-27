import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { summary, summaryAccent } from '../data.js';
import { useTranslated } from '../utils.jsx';

function Word({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span className={`reveal-word${accent ? ' accent' : ''}`} style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

export default function TextReveal() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = summary.split(' ');
  const labelOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  // Word-by-word spans translate badly, so hand the translator one whole sentence
  const translated = useTranslated();
  const paraOpacity = useTransform(scrollYProgress, [0.05, 0.4], [0.15, 1]);

  return (
    <section id="about" ref={ref} className="text-reveal">
      <div className="text-reveal-sticky">
        <motion.p className="eyebrow" style={{ opacity: labelOpacity }}>
          About me
        </motion.p>
        {translated ? (
          <motion.p className="reveal-para" style={{ opacity: paraOpacity }}>
            {summary}
          </motion.p>
        ) : (
        <p className="reveal-para">
          {words.map((w, i) => {
            const start = 0.05 + (i / words.length) * 0.8;
            const end = start + 0.8 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]} accent={summaryAccent.includes(w)}>
                {w}
              </Word>
            );
          })}
        </p>
        )}
      </div>
    </section>
  );
}
