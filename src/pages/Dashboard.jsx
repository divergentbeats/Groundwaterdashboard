import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Droplets, TrendingUp, BellRing, MapPin, HomeIcon, LineChart as LineChartIcon, BarChart3 } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { stations, setCurrentView } = useApp();
  const mapCenter = [20.5937, 78.9629]; // Center of India

  // Calculate average water level
  const avgWaterLevel = stations.reduce((sum, station) => sum + station.currentLevel, 0) / stations.length;
  
  // Calculate average recharge rate
  const avgRechargeRate = stations.reduce((sum, station) => sum + station.rechargeRate, 0) / stations.length;
  
  // Count stations with low water levels (below 8m)
  const lowLevelStations = stations.filter(station => station.currentLevel < 8).length;

  // Combined data for comparison chart
  const comparisonData = stations.map(station => ({
    name: station.name.replace(' DWLR Station', ''),
    level: station.currentLevel,
    recharge: station.rechargeRate
  }));

  return (
    <div className="min-h-full flex flex-col w-full">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full">
        <StatCard 
          title="Average Water Level" 
          value={`${avgWaterLevel.toFixed(1)}m`} 
          icon={<Droplets className="text-cyan-300" />}
          trend="-0.3m from last month"
          trendDirection="down"
        />
        <StatCard 
          title="Recharge Rate" 
          value={`${avgRechargeRate.toFixed(1)} mm/day`} 
          icon={<TrendingUp className="text-emerald-300" />}
          trend="+0.2 from last month"
          trendDirection="up"
        />
        <StatCard 
          title="Low Level Alerts" 
          value={`${lowLevelStations} stations`} 
          icon={<BellRing className="text-amber-300" />}
          trend="No change from last month"
          trendDirection="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 w-full">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <LineChartIcon size={18} className="text-cyan-300" />
              Water Level Trends
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stations[0].historicalData}>
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
                    stroke="#0ea5e9" 
                    strokeWidth={2} 
                    dot={{ fill: "#0ea5e9" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <MapPin size={18} className="text-cyan-300" />
              Station Map
            </h2>
            <div className="h-[300px] rounded-xl overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {stations.map((station) => (
                  <Marker
                    key={station.id}
                    position={station.location}
                  >
                    <Popup>
                      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <h3 className="font-semibold text-sm text-white">{station.name}</h3>
                        <div className="text-xs mt-1 text-cyan-100">
                          Current Level: {station.currentLevel}m
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="mt-6 w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald-300" />
            Station Comparison
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
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
                <Legend wrapperStyle={{ color: 'white' }} />
                <Bar dataKey="level" name="Water Level (m)" fill="#0ea5e9" />
                <Bar dataKey="recharge" name="Recharge Rate (mm/day)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendDirection }) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-cyan-300';
      case 'down': return 'text-rose-300';
      default: return 'text-cyan-300';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col hover:bg-white/15 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-cyan-100 mb-2">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
      <div className={`mt-4 text-xs ${getTrendColor()}`}>
        {trend}
      </div>
    </div>
  );
};

export default Dashboard;