import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, spotlight } from '../utils.jsx';
import { monitoringTools, traceSpans } from '../data.js';

const POINTS = 48;
const jitter = (base, spread) => base + (Math.random() - 0.5) * spread;
const seed = (base, spread) => Array.from({ length: POINTS }, () => jitter(base, spread));

const logTemplates = [
  ['info', () => `GET /api/v1/analytics 200 ${Math.round(jitter(40, 30))}ms`],
  ['info', () => `GET /api/v1/reports?page=${1 + Math.floor(Math.random() * 9)} 200 ${Math.round(jitter(60, 40))}ms`],
  ['info', () => `cache HIT report:${Math.floor(Math.random() * 90) + 10} (redis ${Math.round(jitter(2, 2))}ms)`],
  ['info', () => `worker#${1 + Math.floor(Math.random() * 4)} processed gitlab.pipeline batch (${Math.floor(jitter(500, 300))} events)`],
  ['warn', () => `slow query reports.aggregate ${Math.round(jitter(320, 80))}ms — index hint applied`],
  ['info', () => `POST /api/v1/auth/refresh 200 ${Math.round(jitter(18, 10))}ms`],
  ['error', () => `upstream timeout gitlab.com — circuit OPEN, retry in 10s`],
];

const pickLog = (id) => {
  const r = Math.random();
  const [level, make] = r > 0.95 ? logTemplates[6] : r > 0.85 ? logTemplates[4] : logTemplates[Math.floor(Math.random() * 4) + (Math.random() > 0.7 ? 1 : 0)];
  return { id, level, msg: make(), time: new Date().toLocaleTimeString('en-GB') };
};

function toPath(values, max, h = 160, w = 480) {
  const step = w / (values.length - 1);
  return values.map((v, i) => `${i ? 'L' : 'M'} ${(i * step).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`).join(' ');
}

function Dashboard() {
  const ref = useRef(null);
  const live = useInView(ref, { margin: '-80px' });
  const [p95, setP95] = useState(() => seed(112, 30));
  const [p50, setP50] = useState(() => seed(46, 14));
  const [kpi, setKpi] = useState({ rps: 1284, p95: 112, err: 0.02, apdex: 0.98 });
  const [logs, setLogs] = useState(() => Array.from({ length: 6 }, (_, i) => pickLog(i)));
  const logId = useRef(100);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      const next95 = jitter(112, 34) + (Math.random() > 0.93 ? 60 : 0);
      setP95((v) => [...v.slice(1), next95]);
      setP50((v) => [...v.slice(1), jitter(46, 14)]);
      setKpi({ rps: Math.round(jitter(1284, 160)), p95: Math.round(next95), err: +Math.abs(jitter(0.02, 0.03)).toFixed(2), apdex: +Math.min(1, jitter(0.97, 0.03)).toFixed(2) });
    }, 1100);
    const l = setInterval(() => setLogs((v) => [...v.slice(-6), pickLog(logId.current++)]), 1400);
    return () => {
      clearInterval(t);
      clearInterval(l);
    };
  }, [live]);

  const max = 220;
  const line95 = toPath(p95, max);
  const line50 = toPath(p50, max);

  const tiles = [
    { label: 'Throughput', value: kpi.rps.toLocaleString('en-IN'), unit: 'req/s', src: 'Prometheus' },
    { label: 'Latency p95', value: kpi.p95, unit: 'ms', src: 'Instana', warn: kpi.p95 > 160 },
    { label: 'Error rate', value: kpi.err, unit: '%', src: 'Prometheus' },
    { label: 'Apdex', value: kpi.apdex, unit: '', src: 'Instana' },
  ];

  return (
    <div className="dash" ref={ref}>
      <div className="dash-bar">
        <span className="live-dot" />
        <b>analytics-api</b>
        <span className="dash-env">production</span>
        <span className="dash-range">Last 15 min · auto-refresh</span>
      </div>

      <div className="dash-tiles">
        {tiles.map((t) => (
          <div key={t.label} className={`dash-tile${t.warn ? ' warn' : ''}`}>
            <span className="dash-src">{t.src}</span>
            <span className="dash-label">{t.label}</span>
            <b>
              {t.value}
              <small>{t.unit}</small>
            </b>
          </div>
        ))}
      </div>

      <div className="dash-mid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>HTTP latency</span>
            <span className="dash-src">Grafana · Prometheus</span>
          </div>
          <code className="promql">histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))</code>
          <svg viewBox="0 0 480 160" preserveAspectRatio="none" className="dash-chart">
            <defs>
              <linearGradient id="latFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#a259ff" stopOpacity="0.35" />
                <stop offset="1" stopColor="#a259ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[40, 80, 120].map((y) => (
              <line key={y} x1="0" x2="480" y1={y} y2={y} className="dash-grid" />
            ))}
            <line x1="0" x2="480" y1={160 - (160 / max) * 180} y2={160 - (160 / max) * 180} className="dash-slo" />
            <path d={`${line95} L 480 160 L 0 160 Z`} fill="url(#latFill)" />
            <path d={line95} className="dash-line p95" />
            <path d={line50} className="dash-line p50" />
          </svg>
          <div className="dash-legend">
            <span>
              <i className="p95" /> p95
            </span>
            <span>
              <i className="p50" /> p50
            </span>
            <span>
              <i className="slo" /> SLO 180ms
            </span>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>Distributed trace · 184 ms</span>
            <span className="dash-src">IBM Instana</span>
          </div>
          <div className="trace">
            {traceSpans.map((s, i) => (
              <div key={s.name} className="span-row">
                <span className="span-name">
                  <i className={`svc ${s.svc}`} />
                  {s.name}
                </span>
                <div className="span-track">
                  <motion.span
                    className={`span-bar ${s.svc}`}
                    style={{ left: `${s.start}%` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.dur}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.18 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <span>Logs</span>
          <span className="dash-src">Loki</span>
        </div>
        <code className="promql">{'{app="analytics-api", env="production"} | json | level != "debug"'}</code>
        <div className="logs" data-lenis-prevent>
          <AnimatePresence initial={false}>
            {logs.map((l) => (
              <motion.p key={l.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <span className="log-time">{l.time}</span>
                <span className={`log-lvl ${l.level}`}>{l.level}</span>
                {l.msg}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Observability() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section id="observability" className="section observability">
      <SectionHeading
        eyebrow="Monitoring & APM"
        lines={['If it runs,', 'I can see it.']}
        sub="Metrics, logs and traces wired in from day one — so incidents get a root cause, not a guess. That's how I cut downtime by 25%."
        center
      />
      <div className="dash-stage" ref={ref}>
        <motion.div style={{ scale, rotateX, opacity }} className="dash-wrap">
          <Dashboard />
        </motion.div>
      </div>

      <div className="mon-tools">
        {monitoringTools.map((t, i) => (
          <motion.div
            key={t.name}
            className="mon-tool"
            onMouseMove={spotlight}
            data-cursor
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
          >
            <span className="concept-tag">{t.role}</span>
            <h3>{t.name}</h3>
            <p>{t.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="signals">
        {['Latency', 'Traffic', 'Errors', 'Saturation'].map((s, i) => (
          <motion.span key={s} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}>
            {s}
          </motion.span>
        ))}
        <small>The four golden signals I alert on.</small>
      </div>
    </section>
  );
}
