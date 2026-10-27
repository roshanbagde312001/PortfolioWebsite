import { useEffect, useState } from 'react';
import { profile } from '../data.js';
import { scrollToId } from '../utils.jsx';

function puneTime() {
  return new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export default function Footer() {
  const [time, setTime] = useState(puneTime);

  useEffect(() => {
    const id = setInterval(() => setTime(puneTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-row">
        <div>
          <span className="footer-label">Local time</span>
          <span className="footer-val">
            <span className="live-dot" /> {time} · Pune, IN
          </span>
        </div>
        <div>
          {/* <span className="footer-label">Built with</span> */}
          {/* <span className="footer-val">React · Framer Motion · Lenis</span> */}
        </div>
        <button className="footer-top" onClick={() => scrollToId('home')}>
          Back to top ↑
        </button>
      </div>
      <div className="footer-name notranslate" translate="no" aria-hidden>
        {profile.name}
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} {profile.name}. Designed &amp; engineered with care.
      </p>
    </footer>
  );
}
