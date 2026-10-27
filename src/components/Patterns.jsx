import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, renderTokens, tokenizeJS, useTypewriter } from '../utils.jsx';
import { patterns, principles } from '../data.js';

export default function Patterns() {
  const [sel, setSel] = useState(0);
  const p = patterns[sel];
  const tokens = useMemo(() => tokenizeJS(p.code), [p]);
  const shown = useTypewriter(p.code.length, 700, sel);

  return (
    <section id="patterns" className="section patterns">
      <SectionHeading
        eyebrow="Design patterns"
        lines={['Patterns that keep', 'code clean.']}
        sub="Not textbook trivia — these are the patterns I actually use in Node.js services. Pick one to see it in code."
      />

      <motion.div
        className="pt"
        initial={{ opacity: 0, y: 80, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="pt-list" data-lenis-prevent>
          {patterns.map((x, i) => (
            <button key={x.name} className={`pt-item${i === sel ? ' active' : ''}`} onClick={() => setSel(i)}>
              {i === sel && <motion.span layoutId="pt-active" className="pt-active" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="pt-cat">{x.category}</span>
              <span className="pt-name">{x.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-panel">
          <AnimatePresence mode="wait">
            <motion.div key={sel} className="pt-info" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
              <span className="pt-badge">{p.category}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <p className="pt-use">
                <b>Where I use it:</b> {p.use}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="pt-code">
            <div className="editor-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="editor-file">{p.file}</span>
            </div>
            <pre>
              {renderTokens(tokens, shown)}
              {shown < p.code.length && <span className="caret" />}
            </pre>
          </div>
        </div>
      </motion.div>

      <div className="principles">
        {principles.map((x, i) => (
          <motion.span
            key={x}
            className="principle"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
          >
            {x}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
