import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, animate = true, onClick }) => {
  const base = 'glass-card relative overflow-hidden';
  const hoverClass = hover ? 'hover:border-white/10 transition-all duration-300 hover:shadow-lg' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  if (!animate) {
    return (
      <div className={`${base} ${hoverClass} ${clickClass} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${base} ${hoverClass} ${clickClass} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;
