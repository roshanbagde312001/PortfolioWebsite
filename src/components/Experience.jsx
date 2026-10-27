import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SectionHeading from './SectionHeading.jsx';
import { EASE, highlightMetrics } from '../utils.jsx';
import { education, experience, languages } from '../data.js';

export default function Experience() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="experience" className="section experience">
      <SectionHeading eyebrow="Experience" lines={['Where I’ve been', 'shipping.']} />

      <div className="timeline" ref={ref}>
        <div className="timeline-line">
          <motion.div className="timeline-fill" style={{ scaleY }} />
        </div>

        {experience.map((job) => (
          <motion.article
            key={job.company}
            className="job"
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: EASE }}
          >
            <span className={`job-node${job.current ? ' current' : ''}`} />
            <div className="job-meta">
              <span className="job-period">{job.period}</span>
              {job.current && <span className="job-now">Current</span>}
            </div>
            <div className="job-card">
              <h3>{job.role}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-loc">{job.location}</p>
              <ul>
                {job.points.map((p, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
                  >
                    {highlightMetrics(p)}
                  </motion.li>
                ))}
              </ul>
              <div className="chips">
                {job.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="edu-row">
        <motion.div className="edu-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
          <span className="edu-label">Education</span>
          <h3>{education.degree}</h3>
          <p>
            {education.school} · {education.period}
          </p>
        </motion.div>
        <motion.div className="edu-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}>
          <span className="edu-label">Languages</span>
          <div className="langs">
            {languages.map((l) => (
              <div key={l.name}>
                <h3>{l.name}</h3>
                <p>{l.level}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
