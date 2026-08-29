import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Building2, Shield, Navigation,
  Brain, Activity, FileText, Settings, LogOut,
  AlertTriangle, Wifi, ChevronRight
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { path: '/map', icon: Map, label: 'Risk Map' },
  { path: '/settlements', icon: Building2, label: 'Settlements' },
  { path: '/safe-sites', icon: Shield, label: 'Safe Sites' },
  { path: '/relocation', icon: Navigation, label: 'Relocation' },
  { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
  { path: '/simulation', icon: Activity, label: 'Simulation' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 h-screen bg-navy-900 border-r border-white/5 flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-teal-400 flex items-center justify-center shadow-glow">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider">SafeGround</h1>
            <p className="text-[11px] text-blue-400 font-medium tracking-tight">AI Decision Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-600 uppercase tracking-widest px-3 py-2 font-medium">Navigation</p>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* System status */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10">
          <Wifi size={14} className="text-green-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-400 font-medium">System Online</p>
            <p className="text-xs text-gray-600 truncate">AI Engine Active</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
