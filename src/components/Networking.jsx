import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, useIsMobile, useTypewriter } from '../utils.jsx';
import { ExplodedStack } from './Exploded.jsx';
import { netConcepts, netLanes, netMessages, netSteps, osiStack, ports } from '../data.js';

/* ---------------- Request journey (sequence diagram) ---------------- */

const seqLayouts = {
  desktop: { w: 640, lanes: [80, 240, 400, 560], headW: 120, headH: 38, row0: 86, rowH: 29 },
  mobile: { w: 360, lanes: [45, 135, 225, 315], headW: 82, headH: 34, row0: 80, rowH: 28 },
};

function Sequence({ step, mobile }) {
  const L = mobile ? seqLayouts.mobile : seqLayouts.desktop;
  const height = L.row0 + netMessages.length * L.rowH + 10;
  return (
    <svg className={`seq${mobile ? ' mobile' : ''}`} viewBox={`0 0 ${L.w} ${height}`} role="img" aria-label="HTTPS request sequence diagram">
      <defs>
        <marker id="seqArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#f5f5f7" />
        </marker>
        <marker id="seqArrowActive" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#2997ff" />
        </marker>
      </defs>

      {netLanes.map((name, i) => (
        <g key={name}>
          <line x1={L.lanes[i]} x2={L.lanes[i]} y1={12 + L.headH} y2={height} className="seq-life" />
          <rect x={L.lanes[i] - L.headW / 2} y="12" width={L.headW} height={L.headH} rx="10" className="seq-head" />
          <text x={L.lanes[i]} y={12 + L.headH / 2 + 5} className="seq-head-label">
            {name}
          </text>
        </g>
      ))}

      {netMessages.map((m, i) => {
        const y = L.row0 + i * L.rowH;
        const x1 = L.lanes[m.from];
        const x2 = L.lanes[m.to];
        const dir = x2 > x1 ? 1 : -1;
        const on = step >= m.step;
        const active = step === m.step;
        return (
          <motion.g key={i} initial={false} animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.4 }}>
            <motion.line
              x1={x1 + dir * 4}
              x2={x2 - dir * 6}
              y1={y}
              y2={y}
              className={`seq-msg${active ? ' active' : ''}${m.from > m.to ? ' back' : ''}`}
              markerEnd={`url(#${active ? 'seqArrowActive' : 'seqArrow'})`}
              initial={false}
              animate={{ pathLength: on ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: on ? (i % 3) * 0.12 : 0 }}
            />
            <text x={(x1 + x2) / 2} y={y - 7} className={`seq-label${active ? ' active' : ''}`}>
              {mobile ? m.m ?? m.label : m.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

function Journey() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(netSteps.length - 1, Math.floor(v * netSteps.length)));
  });

  const current = netSteps[step];
  const elapsed = netSteps.slice(0, step + 1).reduce((sum, s) => sum + parseInt(s.ms, 10), 0);

  return (
    <section id="networking" ref={ref} className="sd net">
      <div className="sd-sticky">
        <div className="sd-text">
          <p className="eyebrow">Networking</p>
          <h2 className="section-title sd-title">
            What happens when <span className="grad">you hit Enter.</span>
          </h2>

          <ol className="sd-steps">
            {netSteps.map((s, i) => (
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
                  Step {step + 1} / {netSteps.length} · +{current.ms} · total {elapsed} ms
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
          <Sequence step={step} mobile={mobile} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- OSI model: exploded view + encapsulation ---------------- */

const ENCAP = [
  { k: 'eth', label: 'ETH', from: 2 },
  { k: 'ip', label: 'IP', from: 3 },
  { k: 'tcp', label: 'TCP', from: 4 },
  { k: 'tls', label: 'TLS', from: 6 },
  { k: 'data', label: 'HTTP data', from: 7 },
  { k: 'fcs', label: 'FCS', from: 2 },
];

function Encapsulation({ layer }) {
  if (!layer) return null;
  return (
    <div className="encap" aria-label="Encapsulation">
      {layer.n === 1 ? (
        <motion.code key="bits" className="encap-bits" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          01001000 01010100 01010100 01010000 …
        </motion.code>
      ) : (
        <AnimatePresence initial={false}>
          {ENCAP.filter((p) => layer.n <= p.from).map((p) => (
            <motion.span
              key={p.k}
              layout
              className={`encap-part ${p.k}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {p.label}
            </motion.span>
          ))}
        </AnimatePresence>
      )}
      <span className="encap-pdu">{layer.tag}</span>
    </div>
  );
}

function OsiExploded() {
  return (
    <ExplodedStack
      id="osi"
      layers={osiStack}
      intro={{ eyebrow: 'The OSI model', title: 'Every packet has ', grad: 'layers.' }}
      mid={{ eyebrow: 'Encapsulation, layer by layer', idle: 'Seven layers down.' }}
      outro={{ eyebrow: 'Down to the wire', title: 'From HTTP ', grad: 'to the wire.' }}
      renderMidExtra={(layer) => <Encapsulation layer={layer} />}
    />
  );
}

/* ---------------- Ports reference ---------------- */

function Ports() {
  return (
    <div className="ports">
      <span className="edu-label">Quick reference</span>
      <h3>Ports I live on.</h3>
      <div className="ports-list">
        {ports.map((p, i) => (
          <motion.div
            key={p.port}
            className="port"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
          >
            <code>{p.port}</code>
            <span>{p.name}</span>
            <small>{p.proto}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Subnet calculator ---------------- */

const toIp = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');

function parseCidr(input) {
  const m = input.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!m) return null;
  const octets = m.slice(1, 5).map(Number);
  const prefix = Number(m[5]);
  if (octets.some((o) => o > 255) || prefix > 32) return null;

  const ip = octets.reduce((acc, o) => ((acc << 8) | o) >>> 0, 0);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const small = prefix >= 31;
  const [a, b] = octets;
  const isPrivate = a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);

  return {
    ip,
    prefix,
    mask: toIp(mask),
    network: toIp(network),
    broadcast: toIp(broadcast),
    first: toIp(small ? network : network + 1),
    last: toIp(small ? broadcast : broadcast - 1),
    hosts: prefix === 32 ? 1 : small ? 2 : 2 ** (32 - prefix) - 2,
    isPrivate,
  };
}

const presets = ['10.0.0.0/16', '10.0.1.0/24', '192.168.1.64/26', '172.16.5.4/30'];

function Subnet() {
  const [value, setValue] = useState('10.0.1.0/24');
  const res = useMemo(() => parseCidr(value), [value]);
  const bits = res ? res.ip.toString(2).padStart(32, '0') : null;

  const rows = res
    ? [
        ['Network', `${res.network}/${res.prefix}`],
        ['Subnet mask', res.mask],
        ['First host', res.first],
        ['Last host', res.last],
        ['Broadcast', res.broadcast],
        ['Usable hosts', res.hosts.toLocaleString('en-IN')],
      ]
    : [];

  return (
    <div className="subnet">
      <span className="edu-label">Interactive · CIDR calculator</span>
      <h3>Subnetting, live.</h3>
      <div className="subnet-input">
        <input value={value} onChange={(e) => setValue(e.target.value)} spellCheck="false" aria-label="CIDR block" placeholder="10.0.1.0/24" />
        {res && <span className={`subnet-tag${res.isPrivate ? ' private' : ''}`}>{res.isPrivate ? 'Private · RFC 1918' : 'Public'}</span>}
      </div>
      <div className="subnet-presets">
        {presets.map((p) => (
          <button key={p} onClick={() => setValue(p)} className={p === value ? 'active' : ''}>
            {p}
          </button>
        ))}
      </div>

      {res ? (
        <>
          <div className="bits" aria-hidden>
            {bits.split('').map((b, i) => (
              <span key={i} className={`bit${i < res.prefix ? ' net' : ' host'}${i % 8 === 7 && i < 31 ? ' gap' : ''}`}>
                {b}
              </span>
            ))}
          </div>
          <div className="bits-legend">
            <span>
              <i className="net" /> network bits ({res.prefix})
            </span>
            <span>
              <i className="host" /> host bits ({32 - res.prefix})
            </span>
          </div>
          <div className="subnet-grid">
            {rows.map(([k, v]) => (
              <div key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="subnet-err">Enter an IPv4 CIDR block like 10.0.1.0/24</p>
      )}
    </div>
  );
}

/* ---------------- Fundamentals as a 12-port switch ---------------- */

const portColors = ['#2997ff', '#a259ff', '#64d2ff', '#ff5c8a', '#ff9f0a', '#30d158'];
const CYCLE_MS = 3600;

function Console({ c, color }) {
  const line = c.cmd;
  const typed = useTypewriter(line.length, Math.min(1100, line.length * 28), c.title);
  const done = typed >= line.length;
  return (
    <div className="nsw-console" style={{ '--c': color }}>
      <div className="nsw-console-bar">
        <i />
        <i />
        <i />
        <span>roshan@edge — {c.tag.toLowerCase()}</span>
      </div>
      <div className="nsw-console-body">
        <p className="nsw-cmd">
          <span className="nsw-prompt">$</span> {line.slice(0, typed)}
          {!done && <span className="nsw-caret" />}
        </p>
        <AnimatePresence>
          {done && (
            <motion.div key="out" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
              {c.out.map((o) => (
                <p key={o} className="nsw-out">
                  {o}
                </p>
              ))}
              <div className="nsw-explain">
                <span className="nsw-tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Switch() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-patch the next port while visible, until the visitor takes over
  useEffect(() => {
    if (!inView || paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % netConcepts.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [inView, paused]);

  const pick = (i) => {
    setActive(i);
    setPaused(true);
  };
  const c = netConcepts[active];
  const color = portColors[active % portColors.length];

  return (
    <motion.div
      ref={ref}
      className="nsw"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: EASE }}
    >
      <div className="nsw-plate">
        <div className="nsw-brand">
          <b className="notranslate" translate="no">RB-SW12</b>
          <span>12-port managed · 12 concepts I work with</span>
          <div className="nsw-status notranslate" translate="no">
            <span>
              <i className="pwr" /> PWR
            </span>
            <span>
              <i className="sys" /> SYS
            </span>
            <span className="nsw-hint">{paused ? 'manual' : 'auto-patching'}</span>
          </div>
        </div>
        <div className="nsw-ports" role="tablist" aria-label="Networking fundamentals">
          {netConcepts.map((p, i) => {
            const on = i === active;
            const pc = portColors[i % portColors.length];
            return (
              <button
                key={p.title}
                role="tab"
                aria-selected={on}
                className={`nsw-port${on ? ' on' : ''}`}
                style={{ '--c': pc }}
                onClick={() => pick(i)}
                onMouseEnter={() => pick(i)}
                data-cursor
              >
                <span className="nsw-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="nsw-leds">
                  <i className="link" />
                  <i className="act" style={{ animationDelay: `${(i * 0.37) % 1.2}s` }} />
                </span>
                <span className="nsw-socket">
                  <AnimatePresence>
                    {on && (
                      <motion.span
                        className="nsw-plug"
                        initial={{ y: '-130%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '-130%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span className="nsw-label">{p.tag}</span>
              </button>
            );
          })}
        </div>
      </div>
      <Console key={active} c={c} color={color} />
    </motion.div>
  );
}

/* ---------------- Section ---------------- */

export default function Networking() {
  return (
    <>
      <Journey />
      <OsiExploded />
      <section className="section net-fund">
        <SectionHeading
          eyebrow="Networking fundamentals"
          lines={['Everything below', 'the API.']}
          sub="Great backends are built on solid networking — from subnets in an AWS VPC to the ports every service listens on. Try the subnet calculator."
        />
        <div className="net-row">
          <Subnet />
          <Ports />
        </div>
        <Switch />
      </section>
    </>
  );
}
