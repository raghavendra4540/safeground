import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
  secondary: 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/10',
  danger: 'bg-red-600/80 hover:bg-red-500 text-white border-transparent',
  success: 'bg-green-600/80 hover:bg-green-500 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border-transparent',
  outline: 'bg-transparent hover:bg-blue-600/10 text-blue-400 border-blue-500/30 hover:border-blue-500/50',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, icon: Icon, className = '', ...props }) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center gap-2 font-medium rounded-lg border transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : Icon ? <Icon size={14} /> : null}
    {children}
  </button>
);

export default Button;
