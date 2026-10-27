import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE } from '../utils.jsx';
import { projects } from '../data.js';

const inView = { once: true, margin: '-60px' };

function Workflow() {
  const cols = ['Requested', 'In review', 'Approved', 'Live'];
  return (
    <div className="viz viz-flow">
      <div className="flow-cols">
        {cols.map((c, i) => (
          <div className="flow-col" key={c}>
            <span className="flow-head">{c}</span>
            {Array.from({ length: 3 - (i % 2) }).map((_, j) => (
              <motion.div
                key={j}
                className="flow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.6, ease: EASE, delay: 0.12 * i + 0.08 * j }}
              >
                <i />
                <i />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="flow-lane">
        <motion.div
          className="flow-mover"
          animate={{ left: ['0%', '25%', '50%', '75%', '75%'] }}
          transition={{ duration: 5, times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, ease: 'easeInOut' }}
        >
          Onboarded ✓
        </motion.div>
      </div>
    </div>
  );
}

const bars = [38, 52, 44, 66, 58, 74, 62, 81, 70, 88, 79, 95];

function Chart() {
  return (
    <div className="viz viz-chart">
      <div className="chart-top">
        <span>Pipeline duration</span>
        <span className="chart-chip">−60% load time</span>
      </div>
      <div className="bars">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="bar"
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={inView}
            transition={{ duration: 1, ease: EASE, delay: i * 0.05 }}
          />
        ))}
      </div>
      <div className="chart-foot">
        <span>GitLab API</span>→<span>Workers</span>→<span>MongoDB</span>→<span>Dashboard</span>
      </div>
    </div>
  );
}

const lines = [
  ['$', 'npm create vite@latest portfolio -- --template react'],
  ['$', 'npm i framer-motion lenis'],
  ['✓', 'scroll-scrubbed scenes ready'],
  ['✓', 'command palette bound to ⌘K'],
  ['✓', 'API playground rate-limited'],
  ['→', 'Local: http://localhost:5173'],
];

function Terminal() {
  return (
    <div className="viz viz-term">
      <div className="editor-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="editor-file">zsh — portfolio</span>
      </div>
      <div className="term-body">
        {lines.map(([p, t], i) => (
          <motion.p key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ delay: 0.3 + i * 0.35, duration: 0.4 }}>
            <span className={p === '$' ? 't-fn' : 't-ok'}>{p}</span> {t}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

const visuals = { workflow: Workflow, chart: Chart, terminal: Terminal };

function ProjectCard({ p, i, progress, total }) {
  const target = 1 - (total - 1 - i) * 0.05;
  const scale = useTransform(progress, [i / total, 1], [1, target]);
  const Visual = visuals[p.visual];

  return (
    <div className="stack-item">
      <motion.article className="project-card" style={{ scale, '--i': i, '--accent': p.color }}>
        <div className="project-info">
          <div className="project-top">
            <span className="project-index">{p.index}</span>
            <span className="project-kind">{p.kind}</span>
          </div>
          <h3>{p.title}</h3>
          <p className="project-desc">{p.desc}</p>
          <ul className="project-points">
            {p.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <div className="project-metrics">
            {p.metrics.map((m) => (
              <div key={m.l}>
                <strong>{m.v}</strong>
                <span>{m.l}</span>
              </div>
            ))}
          </div>
          <div className="chips">
            {p.tech.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="project-visual">
          <Visual />
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section id="projects" className="section projects">
      <SectionHeading eyebrow="Selected work" lines={['Built to solve', 'real problems.']} />
      <div className="stack" ref={ref}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} progress={scrollYProgress} total={projects.length} />
        ))}
      </div>
    </section>
  );
}
