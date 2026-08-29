import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, Lock, User } from 'lucide-react';
import * as authApi from '../services/auth.api.js';
import useAuthStore from '../store/authStore.js';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">HazardShield AI</h1>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-gray-400 text-sm mb-8">Join the disaster intelligence platform</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your name' },
            { field: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
            { field: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
          ].map(({ field, label, icon: Icon, type, placeholder }) => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={type}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="input-field">
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
