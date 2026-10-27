import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './Magnetic.jsx';
import { Bars, playIntro } from './VoiceIntro.jsx';
import { EASE, scrollToId } from '../utils.jsx';
import { profile } from '../data.js';

const nameWords = ['Roshan', 'Bagde.'];

export default function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const filter = useTransform(scrollYProgress, [0, 0.65], ['blur(0px)', 'blur(14px)']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  const show = (delay) => ({
    initial: { opacity: 0, y: 30 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, ease: EASE, delay },
  });

  let charIndex = 0;

  return (
    <section id="home" ref={ref} className="hero">
      <div className="hero-sticky">
        <motion.div className="hero-bg" style={{ scale: bgScale }} aria-hidden>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="grid-overlay" />
        </motion.div>

        <motion.div className="hero-content" style={{ scale, opacity, y, filter }}>
          {/* <motion.div className="badge" {...show(0.2)}>
            <span className="pulse" />
            Available for new opportunities
          </motion.div> */}

          <motion.p className="hero-eyebrow" {...show(0.3)}>
            {profile.role}
          </motion.p>

          <h1 className="hero-title notranslate" translate="no" aria-label={profile.name}>
            {nameWords.map((word) => (
              <span className="word-mask" key={word} aria-hidden>
                {word.split('').map((c) => {
                  const d = 0.35 + charIndex++ * 0.04;
                  return (
                    <motion.span
                      key={charIndex}
                      className="char"
                      initial={{ y: '115%', rotate: 8 }}
                      animate={ready ? { y: 0, rotate: 0 } : {}}
                      transition={{ duration: 1.2, ease: EASE, delay: d }}
                    >
                      {c}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p className="hero-sub" {...show(0.9)}>
            I build <span className="hl">secure, scalable APIs</span> with Node.js &amp; Express — and{' '}
            <span className="hl">fast, beautiful interfaces</span> with React.
          </motion.p>

          <motion.div className="hero-cta" {...show(1.05)}>
            <Magnetic>
              <button className="btn btn-primary" onClick={() => scrollToId('projects')}>
                View my work
                <span className="btn-arrow">→</span>
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost" onClick={() => scrollToId('contact')}>
                Get in touch
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost btn-listen" onClick={playIntro} aria-label="Hear a one-minute spoken introduction">
                <Bars on n={3} />
                Hear my intro
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div className="scroll-hint" style={{ opacity }} initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.6, duration: 1 }}>
          <span className="mouse">
            <span className="wheel" />
          </span>
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}
