import React, { createContext, useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import Layout from './components/Layout';

// Import page components
import Maps from './pages/Maps';
import Dashboard from './pages/Dashboard';
import Stations from './pages/Stations';
import Readings from './pages/Readings';
import Alerts from './pages/Alerts';
import Trends from './pages/Trends';
import Users from './pages/Users';

// Import utilities
import { mockStations } from './utils/constants';

// Global App Context
const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

import { Droplets, Waves, BarChart3, Radar, GaugeCircle, TrendingUp, MapPin, LineChart as LineChartIcon } from 'lucide-react';

// Landing Page - Underwater Theme
const Landing = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Underwater Background */}
      <div className="absolute inset-0">
        {/* Main underwater gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900" />

        {/* Water surface effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-300/80 via-cyan-400/60 to-blue-400/40" />

        {/* Deep water effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/90 via-blue-700/60 to-blue-500/30" />

        {/* Light rays from surface */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute bg-gradient-to-b from-cyan-200/30 via-cyan-300/10 to-transparent"
              style={{
                width: '2px',
                height: '60%',
                left: `${8 + (i * 8)}%`,
                top: '20%',
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + (i * 0.5),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Floating bubbles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-white/20 border border-white/30"
              style={{
                width: 4 + (i % 4) * 2,
                height: 4 + (i % 4) * 2,
                left: `${(i * 7) % 100}%`,
                bottom: `${(i * 5) % 80}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 6 + (i % 3),
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Large bubbles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`big-bubble-${i}`}
              className="absolute rounded-full bg-white/10 border border-white/20"
              style={{
                width: 20 + (i % 3) * 15,
                height: 20 + (i % 3) * 15,
                left: `${10 + (i * 11) % 80}%`,
                bottom: `${20 + (i * 8) % 60}%`,
              }}
              animate={{
                y: [-30, -150, -30],
                x: [0, Math.sin(i) * 30, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 8 + (i % 2),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.8,
              }}
            />
          ))}
        </div>

        {/* Water ripples effect */}
        <div className="absolute top-0 left-0 w-full h-1/3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute border border-cyan-300/20 rounded-full"
              style={{
                width: 100 + i * 50,
                height: 100 + i * 50,
                left: `${(i * 15) % 85}%`,
                top: `${-20 + (i * 5)}%`,
              }}
              animate={{
                scale: [0.8, 1.5, 0.8],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 pt-10 pb-20 w-full">
          <div className="w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              {/* Logo/Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6 mx-auto"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Droplets className="text-white" size={32} />
              </motion.div>

              <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
                <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                  AquaSense
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-cyan-100/90 max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
                Dive deep into sustainable groundwater management with real-time insights
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('Dashboard')}
                className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-semibold shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Waves size={20} />
                <span>Explore Dashboard</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('Trends')}
                className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-cyan-500/20 backdrop-blur-md text-white font-semibold shadow-xl hover:shadow-2xl border border-cyan-400/30 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <BarChart3 size={20} />
                <span>View Trends</span>
              </motion.button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                {
                  icon: <Radar className="text-cyan-300" size={24} />,
                  title: 'Real-time Monitoring',
                  desc: 'Live DWLR water level updates across India.'
                },
                {
                  icon: <GaugeCircle className="text-emerald-300" size={24} />,
                  title: 'Recharge Estimates',
                  desc: 'Dynamic recharge insights from trends.'
                },
                {
                  icon: <TrendingUp className="text-blue-300" size={24} />,
                  title: 'Trends & Analytics',
                  desc: 'Clean charts for quick interpretation.'
                },
                {
                  icon: <MapPin className="text-cyan-300" size={24} />,
                  title: 'Geo Mapping',
                  desc: 'Interactive map with station markers.'
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 font-bold text-lg text-white mb-4">
                    {feature.icon}
                    <span>{feature.title}</span>
                  </div>
                  <p className="text-base text-cyan-100/80 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 pb-16 w-full">
          <div className="w-full">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {[
                { icon: <Droplets size={24} />, label: 'Avg. Water Level (m bgl)', value: 12.0 },
                { icon: <LineChartIcon size={24} />, label: 'Avg. Recharge (Mm³/mo)', value: 1.5 },
                { icon: <MapPin size={24} />, label: 'Active Stations', value: 3 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-white flex items-center gap-6 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-5 rounded-full bg-white/20 text-white shadow-inner">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-wide text-cyan-200/80 mb-2">
                      {stat.label}
                    </div>
                    <Counter end={stat.value} className="text-3xl font-bold text-white" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Animated Counter
const Counter = ({ end, className }) => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let rafId;
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Number((end * t).toFixed(1)));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [end]);
  return <div className={className}>{value}</div>;
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedStation, setSelectedStation] = useState(null);
  const [stations] = useState(mockStations);
  const [theme, setTheme] = useState('dark');
  const [showAbout, setShowAbout] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // App context value
  const appContextValue = useMemo(() => ({
    currentView,
    setCurrentView,
    selectedStation,
    setSelectedStation,
    stations,
    theme,
    toggleTheme,
    showAbout,
    setShowAbout
  }), [currentView, selectedStation, stations, theme, showAbout]);

  // Render the appropriate view based on currentView state
  const renderView = () => {
    if (currentView === 'landing') {
      return <Landing />;
    }
    
    return (
      <Layout>
        {currentView === 'Dashboard' && <Dashboard />}
        {currentView === 'Maps' && <Maps />}
        {currentView === 'Stations' && <Stations />}
        {currentView === 'Readings' && <Readings />}
        {currentView === 'Trends' && <Trends />}
        {currentView === 'Alerts' && <Alerts />}
        {currentView === 'Users' && <Users />}
      </Layout>
    );
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className={`w-full h-screen min-h-screen bg-cyan-900 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {renderView()}
      </div>
    </AppContext.Provider>
  );
}

export default App;


