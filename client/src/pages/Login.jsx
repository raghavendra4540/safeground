import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, Lock, Eye, EyeOff, Cpu, Shield, Activity } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  const fillDemo = () => {
    setEmail('admin@hazardshield.ai');
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 border-r border-white/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-600/15 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-teal-400 flex items-center justify-center shadow-glow">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide">SafeGround</h1>
              <p className="text-xs text-blue-400 font-medium">AI Decision Support Platform</p>
            </div>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Know the Risk.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400">Move Proactively</span><br />
            Before Disaster.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-sm">
            GIS-based multi-hazard risk assessment and sustainable community relocation intelligence.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: AlertTriangle, label: 'Critical Zones', value: '11', color: 'text-red-400' },
            { icon: Shield, label: 'Safe Sites Ready', value: '15', color: 'text-emerald-400' },
            { icon: Cpu, label: 'AI Confidence', value: '95%', color: 'text-blue-400' },
            { icon: Activity, label: 'Monitored Pop.', value: '86.9K', color: 'text-orange-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-xl p-3 border border-white/5">
              <Icon size={16} className={`${color} mb-2`} />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-teal-400 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SafeGround AI</h1>
              <p className="text-xs text-blue-400">Command Center</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to access the disaster intelligence platform</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hazardshield.ai"
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-white/3 border border-white/5">
            <p className="text-xs text-gray-400 font-medium mb-2">Demo Access</p>
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              <p>Email: <span className="text-gray-300 font-mono">admin@hazardshield.ai</span></p>
              <p>Password: <span className="text-gray-300 font-mono">Demo@123</span></p>
            </div>
            <button onClick={fillDemo}
              className="w-full py-2 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-sm font-medium transition-colors border border-blue-500/20">
              Use Demo Account
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">Register here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
