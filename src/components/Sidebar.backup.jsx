import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, MapPin, Activity, AlertTriangle, Users, Settings } from 'lucide-react';
import { useApp } from '../App';

const Sidebar = () => {
  const { currentView, setCurrentView } = useApp();

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: <Home size={20} />, color: 'text-emerald-300' },
    { id: 'Stations', label: 'Stations', icon: <Activity size={20} />, color: 'text-cyan-300' },
    { id: 'Readings', label: 'Readings', icon: <BarChart3 size={20} />, color: 'text-blue-300' },
    { id: 'Trends', label: 'Trends', icon: <BarChart3 size={20} />, color: 'text-purple-300' },
    { id: 'Maps', label: 'Maps', icon: <MapPin size={20} />, color: 'text-green-300' },
    { id: 'Alerts', label: 'Alerts', icon: <AlertTriangle size={20} />, color: 'text-red-300' },
    { id: 'Users', label: 'Users', icon: <Users size={20} />, color: 'text-yellow-300' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-emerald-900/20 via-cyan-900/20 to-blue-900/20 backdrop-blur-sm border-r border-emerald-800/30 h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-xl text-white">AquaSense</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-emerald-700/40 text-white shadow-lg border border-emerald-600/50'
                  : 'text-emerald-100 hover:bg-emerald-700/20 hover:text-white'
              }`}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={item.color}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
