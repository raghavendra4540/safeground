import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 20, className = '' }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

const MESSAGES = [
  'Analyzing hazard layers...',
  'Evaluating vulnerable population...',
  'Comparing safe-site capacity...',
  'Optimizing relocation route...',
  'Processing risk vectors...',
];

export const AIThinkingLoader = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center gap-4 py-8"
  >
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 animate-spin border-t-blue-500" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
      </div>
    </div>
    <motion.p
      className="text-sm text-blue-400 font-medium"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {message || 'HazardShield AI is analyzing...'}
    </motion.p>
  </motion.div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <AIThinkingLoader message="Loading data..." />
  </div>
);

export const SkeletonCard = () => (
  <div className="glass-card animate-pulse">
    <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
    <div className="h-8 bg-white/5 rounded w-1/2 mb-2" />
    <div className="h-3 bg-white/5 rounded w-2/3" />
  </div>
);

export default Spinner;
