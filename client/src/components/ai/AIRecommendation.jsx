import { motion } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';

const AIRecommendation = ({ data, compact = false }) => {
  if (!data) return null;
  const { explanation, recommendation, confidence, source } = data;
  const text = explanation || recommendation || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Brain size={14} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-300">AI Recommendation</p>
            <p className="text-xs text-gray-500">{source === 'ai_model' ? 'Powered by AI' : 'Deterministic Engine'}</p>
          </div>
        </div>
        {confidence && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-xs font-medium text-blue-300">{confidence}% confidence</span>
          </div>
        )}
      </div>

      <p className={`text-sm text-gray-300 leading-relaxed whitespace-pre-line ${compact ? 'line-clamp-4' : ''}`}>
        {text}
      </p>
    </motion.div>
  );
};

export default AIRecommendation;
