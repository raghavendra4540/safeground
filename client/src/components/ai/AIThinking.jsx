import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

const STEPS = [
  'Analyzing hazard layers...',
  'Evaluating vulnerable population...',
  'Comparing safe-site capacity...',
  'Optimizing relocation route...',
  'Processing risk vectors...',
  'Synthesizing recommendations...',
];

const AIThinking = ({ active = true }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setStepIndex(i => (i + 1) % STEPS.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col items-center gap-5 py-10"
        >
          {/* Animated brain icon */}
          <div className="relative">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-blue-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-blue-500/40 border-t-blue-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={20} className="text-blue-400" />
            </div>
          </div>

          {/* Animated step text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-blue-300"
            >
              {STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>

          <p className="text-xs text-gray-500">Recommendation ready shortly...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIThinking;
