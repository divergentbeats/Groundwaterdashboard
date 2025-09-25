import React from 'react';
import { MapPin, LineChart, Home, Map, TrendingUp, BellRing, Table, Users } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { currentView, setCurrentView } = useApp();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'maps', label: 'Maps', icon: <Map size={20} /> },
    { id: 'stations', label: 'Stations', icon: <MapPin size={20} /> },
    { id: 'readings', label: 'Readings', icon: <Table size={20} /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={20} /> },
    { id: 'alerts', label: 'Alerts', icon: <BellRing size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-16 sm:w-64 bg-cyan-900/20 border-r border-cyan-800/30 h-[calc(100vh-56px)] sticky top-[56px] flex flex-col">
      <nav className="p-2 flex flex-col gap-1.5 mt-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentView(item.label)}
            className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
              currentView === item.label
                ? 'bg-cyan-700/50 text-white'
                : 'text-cyan-100 hover:bg-cyan-800/30'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={`${currentView === item.label ? 'text-cyan-300' : 'text-cyan-400'}`}>
              {item.icon}
            </span>
            <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
            {currentView === item.label && (
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r"
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