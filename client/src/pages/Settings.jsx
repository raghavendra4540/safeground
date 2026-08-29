import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, Cpu, Bell, Globe, Save } from 'lucide-react';
import useAuthStore from '../store/authStore.js';

const Settings = () => {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Platform configuration and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">Profile</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Name</label>
            <input defaultValue={user?.name} className="input-field" readOnly />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
            <input defaultValue={user?.email} className="input-field" readOnly />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Role</label>
            <input defaultValue={user?.role} className="input-field capitalize" readOnly />
          </div>
        </div>
      </div>

      {/* AI Config */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">AI Configuration</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <div>
              <p className="text-sm text-gray-200">AI Mode</p>
              <p className="text-xs text-gray-500">Configure AI_API_KEY in server .env to enable live AI</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Fallback Engine</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <p className="text-sm text-gray-200">Risk Engine</p>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Deterministic</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-gray-200">Analysis Confidence</p>
            <span className="text-sm font-semibold text-blue-400">94%</span>
          </div>
        </div>
      </div>

      {/* Risk Weights */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">Risk Weight Configuration</h3>
          <span className="ml-auto text-xs text-gray-500">Default weights shown</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Flood Risk', value: 30 },
            { label: 'Landslide Risk', value: 20 },
            { label: 'Cyclone Risk', value: 15 },
            { label: 'Heat Risk', value: 10 },
            { label: 'Population Exposure', value: 10 },
            { label: 'Infrastructure Vulnerability', value: 10 },
            { label: 'Accessibility Risk', value: 5 },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm text-gray-300 w-48">{label}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value * 3}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-8 text-right">{value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">System Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {[
            { label: 'Version', value: '1.0.0-MVP' },
            { label: 'Region', value: 'Telangana, India' },
            { label: 'Settlements', value: '30 (demo)' },
            { label: 'Safe Sites', value: '15 (demo)' },
            { label: 'Data Source', value: 'Simulated Demo Data' },
            { label: 'Build', value: 'HazardShield AI Hackathon' },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-gray-500">{label}: </span>
              <span className="text-gray-300">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
      >
        <Save size={15} />
        {saved ? 'Saved!' : 'Save Settings'}
      </motion.button>
    </div>
  );
};

export default Settings;
