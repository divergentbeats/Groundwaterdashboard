import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, HomeIcon } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Alerts = () => {
  const { setCurrentView, setSelectedStation } = useApp();
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [alerts, setAlerts] = useState([
    { 
      id: 'a1', 
      type: 'warning', 
      title: 'Low Water Level', 
      message: 'Station ID-1234 has reported water level below threshold (7.2m)', 
      time: '2 hours ago',
      station: 'Coastal Station 1'
    },
    { 
      id: 'a2', 
      type: 'critical', 
      title: 'Battery Critical', 
      message: 'Station ID-5678 battery level critical (2.1V). Maintenance required.', 
      time: '5 hours ago',
      station: 'Mountain Station 3'
    },
    { 
      id: 'a3', 
      type: 'info', 
      title: 'Maintenance Scheduled', 
      message: 'Routine maintenance scheduled for Station ID-9012 on Oct 15, 2023', 
      time: '1 day ago',
      station: 'Valley Station 7'
    },
    { 
      id: 'a4', 
      type: 'success', 
      title: 'Station Online', 
      message: 'Station ID-3456 is back online after maintenance', 
      time: '2 days ago',
      station: 'River Station 2'
    },
    {
      id: 'a5',
      type: 'warning',
      title: 'Unusual Reading Pattern',
      message: 'Station ID-7890 showing unusual fluctuation patterns in last 24 hours',
      time: '3 days ago',
      station: 'Lake Station 5'
    }
  ]);

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    // Time filter logic
    if (filterTime !== 'all') {
      const timeStr = alert.time;
      if (filterTime === '24h') {
        if (timeStr.includes('day')) return false;
      } else if (filterTime === '7d') {
        if (timeStr.includes('day')) {
          const num = parseInt(timeStr);
          if (num > 7) return false;
        }
      } else if (filterTime === '30d') {
        if (timeStr.includes('day')) {
          const num = parseInt(timeStr);
          if (num > 30) return false;
        }
      }
    }
    return true;
  });

  const resolveAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const viewDetails = (alert) => {
    // Extract station id from message, e.g. 'Station ID-1234'
    const match = alert.message.match(/Station ID-(\d+)/);
    if (match) {
      setSelectedStation(parseInt(match[1]));
      setCurrentView('Readings');
    }
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Back to Home Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('landing')}
        className="group relative mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-cyan-50 font-semibold shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300 self-start"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <HomeIcon size={18} />
        <span>Back to Home</span>
      </motion.button>

      <div className="mb-4 flex-1">
        <h1 className="text-2xl font-bold text-cyan-100 mb-2 flex items-center gap-2">
          <Bell className="text-emerald-300" size={24} />
          System Alerts
        </h1>
        <p className="text-cyan-100 text-sm">
          Monitor and manage alerts from all groundwater stations
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center hover:bg-white/15 transition-all duration-300">
          <div className="rounded-full bg-rose-500/20 p-3 mr-3">
            <AlertTriangle className="text-rose-300" size={20} />
          </div>
          <div>
            <p className="text-sm text-cyan-100">Critical</p>
            <p className="text-xl font-bold text-cyan-50">1</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center hover:bg-white/15 transition-all duration-300">
          <div className="rounded-full bg-amber-500/20 p-3 mr-3">
            <AlertTriangle className="text-amber-300" size={20} />
          </div>
          <div>
            <p className="text-sm text-cyan-100">Warnings</p>
            <p className="text-xl font-bold text-cyan-50">2</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center hover:bg-white/15 transition-all duration-300">
          <div className="rounded-full bg-blue-500/20 p-3 mr-3">
            <Info className="text-blue-300" size={20} />
          </div>
          <div>
            <p className="text-sm text-cyan-100">Info</p>
            <p className="text-xl font-bold text-cyan-50">1</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex items-center hover:bg-white/15 transition-all duration-300">
          <div className="rounded-full bg-emerald-500/20 p-3 mr-3">
            <CheckCircle className="text-emerald-300" size={20} />
          </div>
          <div>
            <p className="text-sm text-cyan-100">Resolved</p>
            <p className="text-xl font-bold text-cyan-50">1</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              Alert Type
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-black focus:border-cyan-300 focus:outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              Time Range
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-black focus:border-cyan-300 focus:outline-none"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/20 backdrop-blur-md text-cyan-50 font-semibold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              Apply Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4 flex-1">
        {filteredAlerts.map(alert => (
          <motion.div 
            key={alert.id} 
            className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 border-l-4 hover:bg-white/15 transition-all duration-300 ${
              alert.type === 'critical' ? 'border-l-rose-400' :
              alert.type === 'warning' ? 'border-l-amber-400' :
              alert.type === 'info' ? 'border-l-blue-400' :
              'border-l-emerald-400'
            }`}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  {alert.type === 'critical' && <AlertTriangle className="text-rose-300" size={20} />}
                  {alert.type === 'warning' && <AlertTriangle className="text-amber-300" size={20} />}
                  {alert.type === 'info' && <Info className="text-blue-300" size={20} />}
                  {alert.type === 'success' && <CheckCircle className="text-emerald-300" size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-100">{alert.title}</h3>
                  <p className="text-sm text-cyan-100 mt-1">{alert.message}</p>
                  <div className="mt-2 flex items-center text-xs text-cyan-200">
                    <span className="mr-3">{alert.time}</span>
                    <span>{alert.station}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => viewDetails(alert)}
                  className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-cyan-50 text-xs font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  View Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => resolveAlert(alert.id)}
                  className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-rose-500/20 backdrop-blur-md text-rose-300 text-xs font-medium border border-rose-400/30 hover:bg-rose-500/30 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Resolve
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-cyan-100 hover:bg-white/20 transition-all duration-300"
          >
            &laquo;
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 min-w-[2.5rem] text-center hover:bg-emerald-500/30 transition-all duration-300"
          >
            1
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-cyan-100 hover:bg-white/20 min-w-[2.5rem] text-center transition-all duration-300"
          >
            2
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-cyan-100 hover:bg-white/20 transition-all duration-300"
          >
            &raquo;
          </motion.button>
        </nav>
      </div>
    </div>
  );
};

export default Alerts;