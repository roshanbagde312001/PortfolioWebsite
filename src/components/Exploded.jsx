import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { EASE, useIsMobile } from '../utils.jsx';
import { stackLayers } from '../data.js';

const TILT = 56;
const SIN = Math.sin((TILT * Math.PI) / 180);

const repeat = (n) => Array.from({ length: n }, (_, i) => <i key={i} />);

/* Little "components" printed on each layer's top face */
function Pattern({ type }) {
  switch (type) {
    // ---- product stack ----
    case 'ui':
      return <div className="xp xp-ui">{repeat(9)}</div>;
    case 'edge':
      return (
        <div className="xp xp-edge">
          <i />
        </div>
      );
    case 'api':
      return <div className="xp xp-api">{repeat(3)}</div>;
    case 'cache':
      return <div className="xp xp-cache" />;
    case 'db':
      return <div className="xp xp-db">{repeat(3)}</div>;
    case 'platform':
      return <div className="xp xp-platform">{repeat(4)}</div>;
    case 'obs':
      return (
        <div className="xp xp-obs">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            <polyline points="0,48 12,40 22,44 34,26 46,32 58,18 70,24 82,10 100,16" />
          </svg>
        </div>
      );
    // ---- OSI model ----
    case 'http':
      return <div className="xp xp-http">{repeat(6)}</div>;
    case 'lock':
      return (
        <div className="xp xp-lock">
          <i className="shackle" />
          <i className="body" />
        </div>
      );
    case 'session':
      return <div className="xp xp-session">{repeat(3)}</div>;
    case 'transport':
      return <div className="xp xp-transport">{repeat(8)}</div>;
    case 'network':
      return (
        <div className="xp xp-network">
          <svg viewBox="0 0 100 100">
            <path d="M18 22 L50 50 L82 26 M50 50 L28 80 M50 50 L78 76 M18 22 L28 80 M82 26 L78 76" />
            {[
              [18, 22],
              [82, 26],
              [50, 50],
              [28, 80],
              [78, 76],
            ].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={x === 50 ? 8 : 5.5} />
            ))}
          </svg>
        </div>
      );
    case 'link':
      return <div className="xp xp-link">{repeat(12)}</div>;
    case 'physical':
      return (
        <div className="xp xp-wave">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            <path d="M0 30 Q 6.25 8 12.5 30 T 25 30 T 37.5 30 T 50 30 T 62.5 30 T 75 30 T 87.5 30 T 100 30" />
            <path d="M0 30 Q 12.5 50 25 30 T 50 30 T 75 30 T 100 30" className="slow" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

function Layer({ l, i, top, explode, state, dims }) {
  const z = useTransform(explode, (e) => i * dims.thick + e * i * dims.gap);
  const transform = useMotionTemplate`translateZ(${z}px)`;
  return (
    <motion.div className={`xl ${state}`} style={{ transform, '--c': l.color }}>
      <div className="xl-face">
        <Pattern type={l.pattern} />
        {top && <span className="xl-shine" />}
      </div>
      <div className="xl-side xl-side-b" />
      <div className="xl-side xl-side-l" />
    </motion.div>
  );
}

function Label({ l, i, n, explode, progress, active, dims, side }) {
  const y = useTransform(explode, (e) => -(i * dims.thick + e * i * dims.gap) * SIN);
  const start = 0.16 + (n - 1 - i) * 0.025;
  const opacity = useTransform(progress, [start, start + 0.08, 0.8, 0.86], [0, 1, 1, 0]);
  const isActive = active === i;
  return (
    <motion.div className={`xlabel ${side}${isActive ? ' active' : ''}${active >= 0 && !isActive ? ' dim' : ''}`} style={{ y, opacity, '--c': l.color }}>
      <span className="xlabel-line" />
      <div className="xlabel-body">
        <b>
          {l.name}
          {l.tag && <em className="xlabel-tag">{l.tag}</em>}
        </b>
        <span>{l.tech}</span>
        <AnimatePresence>
          {isActive && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              {l.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Apple-style exploded view: an assembled block that separates into layers,
 * spotlights each one top → bottom, then reassembles.
 * `layers` are ordered bottom → top.
 */
export function ExplodedStack({ id, layers, intro, mid, outro, midTitle = (l) => l.name, renderMidExtra }) {
  const ref = useRef(null);
  const mobile = useIsMobile();
  const n = layers.length;
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
  const clamp = (min, v, max) => Math.max(min, Math.min(max, v));
  const dims = mobile
    ? { size: 150, gap: clamp(40, (vh - 340) / 5, 84), thick: 8 }
    : { size: 270, gap: clamp(40, (vh - 480) / 5, 70), thick: 12 };
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // assembled → exploded → (spotlight sweep) → reassembled
  const explode = useTransform(scrollYProgress, [0, 0.1, 0.42, 0.8, 0.94, 1], [0, 0, 1, 1, 0, 0]);
  const spin = useTransform(scrollYProgress, [0, 1], [-52, -36]);
  const stackTransform = useMotionTemplate`rotateX(${TILT}deg) rotateZ(${spin}deg)`;
  const lift = useTransform(explode, (e) => ((e * dims.gap + dims.thick) * (n - 1) * SIN) / 2);
  const scale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.86, 1, 1, 1.08]);

  const introOpacity = useTransform(scrollYProgress, [0, 0.04, 0.2, 0.28], [0, 1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.04], [30, 0]);
  const midOpacity = useTransform(scrollYProgress, [0.3, 0.36, 0.8, 0.85], [0, 1, 1, 0]);
  const outroOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.88, 0.95], [30, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.08, 0.4, 0.88, 1], [0.6, 0.35, 0.15, 0.2, 0.8]);

  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.44 || v > 0.8) setActive(-1);
    else setActive(n - 1 - Math.min(n - 1, Math.floor(((v - 0.44) / 0.36) * n)));
  });

  const current = active >= 0 ? layers[active] : null;

  return (
    <section id={id} ref={ref} className="xsec">
      <div className="xsticky">
        <div className={`xhead${renderMidExtra ? ' has-extra' : ''}`}>
          <motion.div className="xhead-item" style={{ opacity: introOpacity, y: introY }}>
            <p className="eyebrow">{intro.eyebrow}</p>
            <h2 className="section-title">
              {intro.title}
              <span className="grad">{intro.grad}</span>
            </h2>
          </motion.div>
          <motion.div className="xhead-item" style={{ opacity: midOpacity }}>
            <p className="eyebrow">{mid.eyebrow}</p>
            <h2 className="section-title xmid">{current ? midTitle(current) : mid.idle}</h2>
            {mobile && current && <p className="xmid-desc">{current.desc}</p>}
            {renderMidExtra && renderMidExtra(current)}
          </motion.div>
          <motion.div className="xhead-item" style={{ opacity: outroOpacity, y: outroY }}>
            <p className="eyebrow">{outro.eyebrow}</p>
            <h2 className="section-title">
              {outro.title}
              <span className="grad">{outro.grad}</span>
            </h2>
          </motion.div>
        </div>

        <motion.div className="xscene" style={{ scale, '--S': `${dims.size}px`, '--T': `${dims.thick}px` }}>
          <motion.div className="xglow" style={{ opacity: glow }} />
          <motion.div className="xanchor" style={{ y: lift }}>
            <motion.div className="xstack" style={{ transform: stackTransform }}>
              {layers.map((l, i) => (
                <Layer key={l.id} l={l} i={i} top={i === n - 1} explode={explode} dims={dims} state={active === i ? 'active' : active >= 0 ? 'dim' : ''} />
              ))}
            </motion.div>
            {layers.map((l, i) => (
              <Label key={l.id} l={l} i={i} n={n} explode={explode} progress={scrollYProgress} active={active} dims={dims} side={mobile || i % 2 === 0 ? 'right' : 'left'} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Exploded() {
  return (
    <ExplodedStack
      id="under-the-hood"
      layers={stackLayers}
      intro={{ eyebrow: 'Under the hood', title: 'Look ', grad: 'inside.' }}
      mid={{ eyebrow: 'Every layer, engineered', idle: 'Seven layers deep.' }}
      outro={{ eyebrow: 'End-to-end', title: 'Seven layers. ', grad: 'One engineer.' }}
    />
  );
}
