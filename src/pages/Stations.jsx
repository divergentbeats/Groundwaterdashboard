import React from 'react';
import { Droplets, TrendingUp, HomeIcon } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Stations = () => {
  const { stations, setCurrentView } = useApp();

  return (
    <div className="h-full flex flex-col w-full">
      {/* Back to Home Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('landing')}
        className="group relative mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white font-semibold shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300 self-start"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <HomeIcon size={18} />
        <span>Back to Home</span>
      </motion.button>

      <div className="mb-4 flex-1">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Droplets className="text-emerald-300" size={24} />
          Monitoring Stations
        </h1>
        <p className="text-cyan-100 text-sm">
          View and manage all groundwater monitoring stations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 flex-1">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

const StationCard = ({ station }) => {
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Station Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{station.name}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-cyan-100">Current Water Level</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-bold text-white">{station.currentLevel}m</p>
                <span className={`ml-2 text-xs ${station.currentLevel < 8 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {station.currentLevel < 8 ? 'Low' : 'Normal'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan-100">Recharge Rate</h3>
              <div className="mt-1 flex items-center">
                <p className="text-2xl font-bold text-white">{station.rechargeRate}</p>
                <span className="ml-1 text-sm text-cyan-200">mm/day</span>
                <TrendingUp className="ml-2 text-emerald-300" size={16} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-cyan-100">Location</h3>
            <p className="mt-1 text-cyan-200">
              {station.location[0].toFixed(4)}, {station.location[1].toFixed(4)}
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md text-white font-medium border border-emerald-400/30 hover:bg-emerald-500/30 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              View Details
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              Edit Station
            </motion.button>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 h-[200px]">
          <h3 className="text-sm font-medium text-cyan-100 mb-2">Historical Levels</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={station.historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ fill: "#10b981" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default Stations;