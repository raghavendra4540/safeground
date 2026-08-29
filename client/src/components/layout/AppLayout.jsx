import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const pageTitles = {
  '/dashboard': 'Regional Disaster Intelligence',
  '/map': 'Risk Map',
  '/settlements': 'Settlement Analysis',
  '/safe-sites': 'Safe Relocation Sites',
  '/relocation': 'Relocation Planner',
  '/ai-insights': 'AI Insights',
  '/simulation': 'Disaster Scenario Simulator',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const AppLayout = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'HazardShield AI';

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0 relative">
        <div className="relative z-50">
          <Topbar title={title} />
        </div>
        <main className="flex-1 overflow-y-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
