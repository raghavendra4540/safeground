import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Brain, Map, Navigation, Shield, Activity, ArrowRight, Zap, Users, Globe } from 'lucide-react';

const FloatingCard = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className={`glass border border-white/10 rounded-xl p-4 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const FEATURES = [
  { icon: Map, title: 'Multi-Hazard GIS Red Zones', desc: 'Interactive risk overlays for flood, landslide, cyclone, and extreme heat dome zones with reactive telemetry.', color: 'text-blue-400' },
  { icon: Brain, title: 'Explainable AI Decision Support', desc: 'Explainable models clearly explain why each settlement is prioritized and why a destination site ranks highest.', color: 'text-purple-400' },
  { icon: Shield, title: 'Host Site Carrying Capacity', desc: 'Checks realistic absorption capacity, identifying bottlenecks in water supply, healthcare, shelter, and roads.', color: 'text-green-400' },
  { icon: Navigation, title: 'Relocation Intelligence', desc: 'Multi-criteria optimization generates viable relocation routes with fleet and transport cost estimation.', color: 'text-cyan-400' },
  { icon: Activity, title: 'Disaster Scenario Simulator', desc: 'Simulate flood surge, cyclone landfall, or compound shocks with before-and-after capacity gap analysis.', color: 'text-orange-400' },
  { icon: Zap, title: 'Automated Action Intelligence', desc: 'Generates structured immediate, 24-hour, 7-day, and long-term disaster management response strategies.', color: 'text-yellow-400' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-950 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-navy-950/85 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-teal-400 flex items-center justify-center shadow-glow">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">SafeGround</span>
            <span className="text-xs text-blue-400 ml-1.5 font-mono">AI</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Sign In</button>
          <button onClick={() => navigate('/login')} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
            Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-3xl" />
          <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              GIS Disaster & Relocation Decision-Support Platform
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Know the Risk.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-cyan-400">Move Proactively</span><br />
              Before Disaster.
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              SafeGround helps authorities identify who is most at risk, decide who needs attention first, and determine where communities can safely and sustainably relocate.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-3">
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl transition-all shadow-glow">
                Launch Command Center <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold rounded-xl border border-white/10 transition-all">
                Explore Demo
              </button>
            </motion.div>
          </div>

          {/* Right: floating stat cards */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[480px]">
              {/* Map preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #0a1628, #0f2040, #152b58)' }}
              >
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 40%, #3b82f6 0, transparent 35%), radial-gradient(circle at 70% 60%, #ef4444 0, transparent 30%), radial-gradient(circle at 50% 70%, #f97316 0, transparent 25%)',
                }} />
                {/* Risk zone circles */}
                {[
                  { x: '30%', y: '40%', size: 90, color: '#ef4444', label: 'CRITICAL' },
                  { x: '62%', y: '55%', size: 70, color: '#f97316', label: 'HIGH' },
                  { x: '45%', y: '72%', size: 60, color: '#3b82f6', label: 'FLOOD' },
                ].map((zone, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
                    transition={{ duration: 3 + i, repeat: Infinity, delay: i * 1.5 }}
                    className="absolute rounded-full"
                    style={{
                      left: zone.x, top: zone.y,
                      width: zone.size, height: zone.size,
                      background: zone.color + '35',
                      border: `2px solid ${zone.color}`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
                <div className="absolute top-3 left-3 text-xs text-blue-300 font-mono">Telangana GIS Telemetry · Active</div>
              </motion.div>

              {/* Floating stat cards */}
              <FloatingCard delay={0.6} className="absolute -top-4 -right-4 w-48">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span className="text-xs text-gray-400">Critical Red Zones</span>
                </div>
                <p className="text-2xl font-bold text-red-400">11</p>
                <p className="text-[11px] text-gray-500">20 multi-hazard zones</p>
              </FloatingCard>

              <FloatingCard delay={0.7} className="absolute top-1/4 -left-8 w-48">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-orange-400" />
                  <span className="text-xs text-gray-400">Population at Risk</span>
                </div>
                <p className="text-2xl font-bold text-orange-400">86.9K</p>
                <p className="text-[11px] text-gray-500">Across 20 high-risk towns</p>
              </FloatingCard>

              <FloatingCard delay={0.8} className="absolute bottom-16 -right-6 w-52">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={14} className="text-emerald-400" />
                  <span className="text-xs text-gray-400">Host Safe Sites</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400">15 Sites</p>
                <p className="text-xs text-gray-400 mt-0.5">47,830 capacity ready</p>
              </FloatingCard>

              <FloatingCard delay={0.9} className="absolute bottom-0 left-4 w-44">
                <div className="flex items-center gap-2 mb-1">
                  <Brain size={14} className="text-blue-400" />
                  <span className="text-xs text-gray-400">AI Confidence</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">95%</p>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>

      {/* Core Workflow */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">The SafeGround Core Workflow</h2>
          <p className="text-gray-400">End-to-end intelligence from hazard modeling to sustainable community relocation</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
          {[
            { step: '1', title: 'Hazard Risk', desc: 'Floods, slides, storms, heat' },
            { step: '2', title: 'Vulnerability', desc: 'Demographics & infra access' },
            { step: '3', title: 'Settlement Priority', desc: 'Urgency & impact ranking' },
            { step: '4', title: 'Safe Sites', desc: 'Designated host zones' },
            { step: '5', title: 'Capacity Check', desc: 'Water, health, land bottlenecks' },
            { step: '6', title: 'Suitability', desc: 'Multi-criteria scoring' },
            { step: '7', title: 'Feasible Plan', desc: 'Transport routes & logistics' },
            { step: '8', title: 'Impact Analysis', desc: 'AI action intelligence' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-3 rounded-xl border border-white/5 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                  Step {item.step}
                </span>
                <p className="text-xs font-bold text-gray-200 mt-1">{item.title}</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Decision Support Capabilities</h2>
          <p className="text-gray-400">Everything needed to move from reactive response to proactive relocation planning</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="glass-card hover:border-white/10 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={20} className={f.color} />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-white mb-4">Start Planning Safer Settlements</h2>
          <p className="text-gray-400 mb-8">Access the complete SafeGround command center for real-time disaster decision support.</p>
          <button onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-base transition-all shadow-glow">
            Launch Command Center <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-gray-500">
        SafeGround AI · GIS-based Disaster Decision-Support Platform · Demonstration Prototype
      </footer>
    </div>
  );
};

export default Landing;

