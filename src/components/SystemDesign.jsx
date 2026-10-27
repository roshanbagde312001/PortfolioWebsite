import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, spotlight, useIsMobile } from '../utils.jsx';
import { archSteps, concepts } from '../data.js';

const nodeInfo = [
  { id: 'client', label: 'Clients', sub: 'web · mobile', step: 0 },
  { id: 'lb', label: 'Nginx', sub: 'LB · TLS · gzip', step: 0 },
  { id: 'api1', label: 'Node API', sub: 'instance 1', step: 1 },
  { id: 'api2', label: 'Node API', sub: 'instance 2', step: 1 },
  { id: 'api3', label: 'Node API', sub: 'instance 3', step: 1 },
  { id: 'redis', label: 'Redis', sub: 'cache · limits', step: 2 },
  { id: 'db1', label: 'Primary DB', sub: 'writes', step: 3 },
  { id: 'db2', label: 'Replica', sub: 'reads', step: 3 },
  { id: 'queue', label: 'Queue', sub: 'events · jobs', step: 4 },
  { id: 'worker', label: 'Workers', sub: 'cron · threads', step: 4 },
];

/* Wide layout for desktop, portrait layout for phones so the diagram stays legible. */
const layouts = {
  desktop: {
    w: 640,
    h: 500,
    W: 116,
    H: 50,
    pos: {
      client: [320, 40], lb: [320, 130], api1: [160, 230], api2: [320, 230], api3: [480, 230],
      redis: [92, 340], db1: [250, 440], db2: [400, 440], queue: [548, 340], worker: [548, 440],
    },
    edges: [
      ['client', 'lb', 0], ['lb', 'api1', 1], ['lb', 'api2', 1], ['lb', 'api3', 1],
      ['api1', 'redis', 2], ['api2', 'redis', 2],
      ['api1', 'db1', 3], ['api2', 'db1', 3], ['api3', 'db2', 3], ['db1', 'db2', 3, true],
      ['api3', 'queue', 4], ['queue', 'worker', 4],
    ],
    observe: { x: 14, y: 182, w: 612, h: 300, labelY: 204 },
    observeLabel: '◉ metrics · logs · traces → Prometheus · Loki · Instana',
  },
  mobile: {
    w: 360,
    h: 396,
    W: 100,
    H: 48,
    pos: {
      client: [180, 28], lb: [180, 102], api1: [62, 186], api2: [180, 186], api3: [298, 186],
      redis: [62, 272], queue: [298, 272], db1: [62, 360], db2: [180, 360], worker: [298, 360],
    },
    edges: [
      ['client', 'lb', 0], ['lb', 'api1', 1], ['lb', 'api2', 1], ['lb', 'api3', 1],
      ['api1', 'redis', 2], ['api2', 'redis', 2],
      ['api2', 'db1', 3], ['api2', 'db2', 3], ['db1', 'db2', 3, true],
      ['api3', 'queue', 4], ['queue', 'worker', 4],
    ],
    observe: { x: 4, y: 136, w: 352, h: 256, labelY: 152 },
    observeLabel: '◉ Prometheus · Loki · Instana',
  },
};

function edgePath(L, a, b) {
  const [ax, ay] = L.pos[a];
  const [bx, by] = L.pos[b];
  if (Math.abs(ay - by) < 10) {
    const dir = bx > ax ? 1 : -1;
    return `M ${ax + (dir * L.W) / 2} ${ay} L ${bx - (dir * L.W) / 2} ${by}`;
  }
  const y1 = ay + L.H / 2;
  const y2 = by - L.H / 2;
  const my = (y1 + y2) / 2;
  return `M ${ax} ${y1} C ${ax} ${my}, ${bx} ${my}, ${bx} ${y2}`;
}

function Diagram({ step, mobile }) {
  const L = mobile ? layouts.mobile : layouts.desktop;
  const { W, H, observe: o } = L;
  const observe = step >= 5;
  return (
    <svg className={`arch${mobile ? ' mobile' : ''}`} viewBox={`0 0 ${L.w} ${L.h}`} role="img" aria-label="Scalable system architecture diagram">
      <defs>
        <linearGradient id="archGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={L.w} y2="0">
          <stop offset="0" stopColor="#2997ff" />
          <stop offset="0.5" stopColor="#a259ff" />
          <stop offset="1" stopColor="#ff5c8a" />
        </linearGradient>
      </defs>

      <motion.rect
        x={o.x}
        y={o.y}
        width={o.w}
        height={o.h}
        rx="22"
        className="arch-observe"
        initial={false}
        animate={{ opacity: observe ? 1 : 0, pathLength: observe ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.text x={o.x + 14} y={o.labelY} className="arch-observe-label" initial={false} animate={{ opacity: observe ? 1 : 0 }}>
        {L.observeLabel}
      </motion.text>

      {L.edges.map(([a, b, s, dashed]) => {
        const d = edgePath(L, a, b);
        const on = step >= s;
        return (
          <g key={a + b}>
            <motion.path
              d={d}
              className={`arch-edge${dashed ? ' dashed' : ''}${s === step ? ' active' : ''}`}
              initial={false}
              animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            {on && !dashed && (
              <circle r="3.5" className="arch-packet">
                <animateMotion dur={`${1.4 + (a.length % 3) * 0.3}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}

      {nodeInfo.map((n) => {
        const [x, y] = L.pos[n.id];
        const on = step >= n.step;
        const active = step === n.step;
        return (
          <motion.g key={n.id} initial={false} animate={{ opacity: on ? 1 : 0.12 }} transition={{ duration: 0.6 }}>
            <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx="12" className={`arch-node${active ? ' active' : ''}`} />
            <text x={x} y={y - 2} className="arch-label">
              {n.label}
            </text>
            <text x={x} y={y + 14} className="arch-sub">
              {n.sub}
            </text>
            {observe && <circle cx={x + W / 2 - 10} cy={y - H / 2 + 10} r="3" className="arch-beacon" />}
          </motion.g>
        );
      })}
    </svg>
  );
}

function Concepts() {
  return (
    <section className="section concepts">
      <SectionHeading eyebrow="Fundamentals" lines={['The building blocks,', 'mastered.']} sub="The system design concepts I reach for when a service has to survive real traffic, real failures, and real growth." />
      <div className="concept-grid">
        {concepts.map((c, i) => (
          <motion.div
            key={c.title}
            className="concept"
            onMouseMove={spotlight}
            data-cursor
            initial={{ opacity: 0, y: 50, rotateX: -12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.07 }}
          >
            <span className="concept-tag">{c.tag}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function SystemDesign() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(archSteps.length - 1, Math.floor(v * archSteps.length)));
  });

  const current = archSteps[step];

  return (
    <>
      <section id="system-design" ref={ref} className="sd">
        <div className="sd-sticky">
          <div className="sd-text">
            <p className="eyebrow">System design</p>
            <h2 className="section-title sd-title">
              Architected <span className="grad">to scale.</span>
            </h2>

            <ol className="sd-steps">
              {archSteps.map((s, i) => (
                <li key={s.title} className={i === step ? 'active' : i < step ? 'done' : ''}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </li>
              ))}
            </ol>

            <div className="sd-detail">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p className="sd-count">
                    Step {step + 1} / {archSteps.length}
                  </p>
                  <h3>{current.title}</h3>
                  <p>{current.text}</p>
                  <div className="chips">
                    {current.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="sd-bar">
              <motion.span style={{ scaleX: barScale }} />
            </div>
          </div>

          <div className="sd-visual">
            <div className="sd-visual-glow" />
            <Diagram step={step} mobile={mobile} />
          </div>
        </div>
      </section>
      <Concepts />
    </>
  );
}
