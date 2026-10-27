import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE } from '../utils.jsx';
import { algorithms, dsaTopics } from '../data.js';

const N = 32;
const PLAY_MS = 4500;

const randomArray = () => Array.from({ length: N }, () => 6 + Math.floor(Math.random() * 94));

/* Each sorter records frames: { arr, cmp: [i, j], swp: [i, j], piv, c } */
function recorder(src) {
  const arr = [...src];
  const frames = [];
  let c = 0;
  const push = (extra = {}) => frames.push({ arr: [...arr], c, ...extra });
  const cmp = (i, j, extra) => {
    c++;
    push({ cmp: [i, j], ...extra });
  };
  return { arr, frames, push, cmp };
}

const sorters = {
  bubble(src) {
    const r = recorder(src);
    const { arr } = r;
    for (let i = 0; i < arr.length; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        r.cmp(j, j + 1);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          r.push({ swp: [j, j + 1] });
        }
      }
      if (!swapped) break;
    }
    return r.frames;
  },
  insertion(src) {
    const r = recorder(src);
    const { arr } = r;
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0) {
        r.cmp(j - 1, j);
        if (arr[j - 1] <= arr[j]) break;
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        r.push({ swp: [j - 1, j] });
        j--;
      }
    }
    return r.frames;
  },
  merge(src) {
    const r = recorder(src);
    const { arr } = r;
    const sort = (lo, hi) => {
      if (hi - lo < 1) return;
      const mid = (lo + hi) >> 1;
      sort(lo, mid);
      sort(mid + 1, hi);
      const left = arr.slice(lo, mid + 1);
      const right = arr.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        r.cmp(lo + i, mid + 1 + j);
        arr[k] = left[i] <= right[j] ? left[i++] : right[j++];
        r.push({ swp: [k, k] });
        k++;
      }
      while (i < left.length) {
        arr[k] = left[i++];
        r.push({ swp: [k, k] });
        k++;
      }
      while (j < right.length) {
        arr[k] = right[j++];
        r.push({ swp: [k, k] });
        k++;
      }
    };
    sort(0, arr.length - 1);
    return r.frames;
  },
  quick(src) {
    const r = recorder(src);
    const { arr } = r;
    const sort = (lo, hi) => {
      if (lo >= hi) return;
      const pivot = arr[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        r.cmp(j, hi, { piv: hi });
        if (arr[j] < pivot) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          r.push({ swp: [i, j], piv: hi });
          i++;
        }
      }
      [arr[i], arr[hi]] = [arr[hi], arr[i]];
      r.push({ swp: [i, hi] });
      sort(lo, i - 1);
      sort(i + 1, hi);
    };
    sort(0, arr.length - 1);
    return r.frames;
  },
};

function build(algo, arr) {
  const frames = sorters[algo](arr);
  const last = frames[frames.length - 1] ?? { arr, c: 0 };
  frames.push({ arr: [...last.arr], c: last.c, done: true });
  return frames;
}

function Visualizer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [algo, setAlgo] = useState('quick');
  const [base, setBase] = useState(randomArray);
  const frames = useMemo(() => build(algo, base), [algo, base]);
  const [fi, setFi] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (inView) setPlaying(true);
  }, [inView]);

  useEffect(() => {
    if (!playing) return;
    const stride = Math.max(1, Math.ceil(frames.length / (PLAY_MS / 16)));
    let frame;
    const tick = () => {
      setFi((i) => Math.min(frames.length - 1, i + stride));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, frames]);

  useEffect(() => {
    if (fi >= frames.length - 1) setPlaying(false);
  }, [fi, frames]);

  const restart = (nextAlgo = algo, nextBase = base) => {
    setAlgo(nextAlgo);
    setBase(nextBase);
    setFi(0);
    setPlaying(true);
  };

  const f = frames[Math.min(fi, frames.length - 1)];
  const info = algorithms[algo];
  const finished = fi >= frames.length - 1;

  return (
    <motion.div
      ref={ref}
      className="viz-sort"
      initial={{ opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div className="sort-top">
        <div className="sort-tabs">
          {Object.entries(algorithms).map(([key, a]) => (
            <button key={key} className={key === algo ? 'active' : ''} onClick={() => restart(key, base)}>
              {key === algo && <motion.span layoutId="sort-tab" className="sort-tab-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span>{a.name}</span>
            </button>
          ))}
        </div>
        <div className="sort-actions">
          <button onClick={() => (finished ? restart() : setPlaying((p) => !p))}>{playing ? 'Pause' : finished ? 'Replay' : 'Play'}</button>
          <button onClick={() => restart(algo, randomArray())}>Shuffle</button>
        </div>
      </div>

      <div className="bars-sort">
        {f.arr.map((v, i) => {
          let cls = '';
          if (f.done) cls = 'sorted';
          else if (f.swp?.includes(i)) cls = 'swap';
          else if (f.cmp?.includes(i)) cls = 'cmp';
          else if (f.piv === i) cls = 'pivot';
          return <span key={i} className={`sbar ${cls}`} style={{ height: `${v}%` }} />;
        })}
      </div>

      <div className="sort-stats">
        <div>
          <span>Comparisons</span>
          <b>{f.c}</b>
        </div>
        <div>
          <span>Best</span>
          <b>{info.best}</b>
        </div>
        <div>
          <span>Average</span>
          <b>{info.avg}</b>
        </div>
        <div>
          <span>Worst</span>
          <b>{info.worst}</b>
        </div>
        <div>
          <span>Space</span>
          <b>{info.space}</b>
        </div>
        <div>
          <span>Stable</span>
          <b>{info.stable ? 'Yes' : 'No'}</b>
        </div>
      </div>
    </motion.div>
  );
}

const curves = [
  { label: 'O(1)', color: '#30d158', f: () => 1 },
  { label: 'O(log n)', color: '#64d2ff', f: (n) => Math.log2(n) },
  { label: 'O(n)', color: '#2997ff', f: (n) => n },
  { label: 'O(n log n)', color: '#a259ff', f: (n) => n * Math.log2(n) },
  { label: 'O(n²)', color: '#ff5c8a', f: (n) => n * n },
  { label: 'O(2ⁿ)', color: '#ff453a', f: (n) => 2 ** n },
];

function BigO() {
  const paths = useMemo(() => {
    const maxY = 64;
    return curves.map((c) => {
      const pts = [];
      for (let n = 1; n <= 20; n += 0.25) {
        const y = c.f(n) / maxY;
        pts.push(`${((n - 1) / 19) * 300},${(200 - y * 190).toFixed(1)}`);
        if (y > 1.06) break;
      }
      return { ...c, d: `M ${pts.join(' L ')}` };
    });
  }, []);

  return (
    <div className="bigo">
      <div className="bigo-head">
        <span className="edu-label">Complexity</span>
        <h3>Big-O, visualised</h3>
      </div>
      <svg viewBox="-8 -4 316 214" className="bigo-svg">
        <defs>
          <clipPath id="bigoClip">
            <rect x="-4" y="0" width="308" height="204" />
          </clipPath>
        </defs>
        <line x1="0" y1="200" x2="300" y2="200" className="bigo-axis" />
        <line x1="0" y1="0" x2="0" y2="200" className="bigo-axis" />
        {paths.map((p, i) => (
          <motion.path
            key={p.label}
            d={p.d}
            stroke={p.color}
            className="bigo-line"
            clipPath="url(#bigoClip)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.2 + i * 0.15 }}
          />
        ))}
      </svg>
      <div className="bigo-legend">
        {curves.map((c) => (
          <span key={c.label}>
            <i style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Algorithms() {
  return (
    <section id="algorithms" className="section algorithms">
      <SectionHeading
        eyebrow="Data structures & algorithms"
        lines={['Fundamentals,', 'in motion.']}
        sub="Strong DSA is what makes the difference between an index and a full scan. Pick an algorithm and watch it work."
      />
      <Visualizer />
      <div className="algo-row">
        <BigO />
        <div className="dsa-grid">
          {dsaTopics.map((t, i) => (
            <motion.div
              key={t.name}
              className="dsa"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.06 }}
            >
              <span className="dsa-name">{t.name}</span>
              <code>{t.o}</code>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
