import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './Magnetic.jsx';
import { copyText } from '../utils.jsx';
import { profile } from '../data.js';

export default function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [120, 36]);

  const links = [
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'GitHub', href: profile.github },
    { label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { label: 'Download résumé', href: profile.resume, download: true },
  ];

  return (
    <section id="contact" className="contact" ref={ref}>
      <motion.div className="contact-inner" style={{ scale, opacity, borderRadius: radius }}>
        <div className="contact-glow" aria-hidden />
        <p className="eyebrow">What’s next?</p>
        <h2 className="contact-title">
          Let’s build
          <br />
          <span className="grad">something great.</span>
        </h2>
        <p className="contact-sub">
          I’m open to full-time roles and ambitious projects. Whether it’s an API that needs to scale or a product that needs to ship — my inbox is open.
        </p>
        <div className="contact-actions">
          <Magnetic>
            <a className="btn btn-primary big" href={`mailto:${profile.email}`}>
              Say hello <span className="btn-arrow">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <button className="btn btn-ghost big" onClick={() => copyText(profile.email, 'Email copied to clipboard')}>
              {profile.email}
              <span className="copy-tag">Copy</span>
            </button>
          </Magnetic>
        </div>
        <div className="contact-links">
          {links.map((l) => (
            <a key={l.label} href={l.href} target={l.download || l.href.startsWith('tel') ? undefined : '_blank'} rel="noreferrer" download={l.download || undefined}>
              {l.label}
              <span>↗</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
