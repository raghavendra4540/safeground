import { motion } from 'framer-motion';
import { Brain, User } from 'lucide-react';

const AIMessage = ({ role = 'ai', content, confidence, timestamp }) => {
  const isAI = role === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isAI ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-gray-700'
      }`}>
        {isAI ? <Brain size={14} className="text-blue-400" /> : <User size={14} className="text-gray-400" />}
      </div>

      <div className={`flex-1 max-w-[85%] ${isAI ? '' : 'items-end flex flex-col'}`}>
        <div className={`rounded-xl p-3.5 text-sm leading-relaxed ${
          isAI
            ? 'bg-navy-800 border border-white/5 text-gray-200'
            : 'bg-blue-600/20 border border-blue-500/20 text-blue-100'
        }`}>
          <p className="whitespace-pre-line">{content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          {confidence && (
            <span className="text-xs text-gray-500">{confidence}% confidence</span>
          )}
          {timestamp && (
            <span className="text-xs text-gray-600">{new Date(timestamp).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIMessage;
