import React from 'react';
import { MapPin, LineChart, Home, Map, TrendingUp, BellRing, Table, Users } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { currentView, setCurrentView } = useApp();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} className="text-emerald-300" /> },
    { id: 'maps', label: 'Maps', icon: <Map size={20} className="text-cyan-300" /> },
    { id: 'stations', label: 'Stations', icon: <MapPin size={20} className="text-emerald-300" /> },
    { id: 'readings', label: 'Readings', icon: <Table size={20} className="text-cyan-300" /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={20} className="text-emerald-300" /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing size={20} className="text-cyan-300" /> },
    { id: 'users', label: 'Users', icon: <Users size={20} className="text-emerald-300" /> },
  ];

  return (
    <aside className="w-16 sm:w-64 bg-gradient-to-b from-cyan-900/20 via-emerald-900/10 to-cyan-900/20 border-r border-emerald-800/30 h-[calc(100vh-56px)] sticky top-[56px] flex flex-col">
      <nav className="p-2 flex flex-col gap-1.5 mt-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentView(item.label)}
            className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 shadow-lg ${
              currentView === item.label
                ? 'bg-emerald-700/50 text-cyan-50 border border-emerald-600/30 shadow-emerald-500/25'
                : 'text-cyan-100 hover:bg-emerald-800/30 hover:text-emerald-100 hover:shadow-emerald-500/10'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={`${currentView === item.label ? 'text-emerald-300' : 'text-cyan-400'}`}>
              {item.icon}
            </span>
            <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
            {currentView === item.label && (
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-r"
                layoutId="sidebar-indicator"
              />
            )}
          </motion.button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;