import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore.js';

// Layout
import AppLayout from './components/layout/AppLayout.jsx';

// Public pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Protected pages
import Dashboard from './pages/Dashboard.jsx';
import RiskMapPage from './pages/RiskMap.jsx';
import Settlements from './pages/Settlements.jsx';
import SafeSites from './pages/SafeSites.jsx';
import Relocation from './pages/Relocation.jsx';
import AIInsights from './pages/AIInsights.jsx';
import Simulation from './pages/Simulation.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, initialized } = useAuthStore();
  if (!initialized) return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    // Listen for auth:logout events from API interceptor
    const handler = () => useAuthStore.getState().logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — all inside AppLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<RiskMapPage />} />
          <Route path="settlements" element={<Settlements />} />
          <Route path="safe-sites" element={<SafeSites />} />
          <Route path="relocation" element={<Relocation />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
