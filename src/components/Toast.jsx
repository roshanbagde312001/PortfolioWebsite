import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Toast() {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let t;
    const on = (e) => {
      setMsg({ text: e.detail, id: Date.now() });
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener('app:toast', on);
    return () => {
      window.removeEventListener('app:toast', on);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          key={msg.id}
          className="toast"
          role="status"
          initial={{ opacity: 0, y: 30, x: '-50%', scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="toast-check">✓</span>
          {msg.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
