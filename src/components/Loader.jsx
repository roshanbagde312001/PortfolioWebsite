import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Hello', 'नमस्ते', 'नमस्कार', 'Hola', 'Bonjour', 'Ciao', 'こんにちは', 'Hello'];

export default function Loader({ onDone }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i === words.length - 1) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setI(i + 1), i === 0 ? 900 : 170);
    return () => clearTimeout(t);
  }, [i, onDone]);

  return (
    <motion.div
      className="loader"
      exit={{ y: '-100%', borderBottomLeftRadius: '50% 12vh', borderBottomRightRadius: '50% 12vh' }}
      transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          className="loader-word"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: i === 0 ? 0.6 : 0.12 }}
        >
          <span className="loader-dot" />
          {words[i]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
