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

// Import utilities
import { stations } from './utils/constants';

import { Droplets, Waves, BarChart3, Radar, GaugeCircle, TrendingUp, MapPin, LineChart as LineChartIcon, Info, X, User, Shield, BookOpen, Settings, CloudRain } from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// StatCard Component (adapted from Dashboard.jsx)
const StatCard = ({ title, value, icon, trend, trendDirection }) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-emerald-300';
      case 'down': return 'text-rose-300';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex flex-col hover:bg-white/15 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-slate-100 mb-2">{title}</h3>
          <p className="text-2xl font-bold text-slate-50">{value}</p>
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

// Role-Based Dashboard Sections
const FarmerSection = () => {
  const { setCurrentView } = useApp();
  const [farmerData, setFarmerData] = useState([]);
  const [avgLevel, setAvgLevel] = useState(0);
  const [chartData, setChartData] = useState([]);

  React.useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        // Fetch from API; fallback to mock
        const response = await fetch('http://localhost:5000/stations?role=farmer&days=7');
        let data = [];
        if (response.ok) {
          data = await response.json();
        } else {
          // Use mockStations and simulate 7-day data
          data = mockStations.map(station => ({
            ...station,
            water_level: station.water_level + (Math.random() - 0.5) * 2, // Simulate variation
            date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }));
        }
        setFarmerData(data);
        const avg = data.reduce((sum, s) => sum + (s.water_level || 0), 0) / data.length;
        setAvgLevel(avg.toFixed(1));

        // Process for 7-day chart (group by date or generate sample)
        const sampleChartData = Array.from({length: 7}, (_, i) => ({
          day: `Day ${7 - i}`,
          water_level: 10 + Math.sin(i) * 3 + (Math.random() - 0.5) * 2
        }));
        setChartData(sampleChartData);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
        // Fallback sample
        setFarmerData(mockStations.slice(0, 5));
        setAvgLevel('12.5');
        setChartData([
          { day: 'Day 1', water_level: 11.2 },
          { day: 'Day 2', water_level: 10.8 },
          { day: 'Day 3', water_level: 12.1 },
          { day: 'Day 4', water_level: 9.5 },
          { day: 'Day 5', water_level: 11.0 },
          { day: 'Day 6', water_level: 10.3 },
          { day: 'Day 7', water_level: 11.8 }
        ]);
      }
    };
    fetchFarmerData();
  }, []);

  const irrigationAdvice = avgLevel > 10 ? 'Optimal for irrigation' : 'Conserve water - levels low';
  const trendDirection = avgLevel > 11 ? 'up' : avgLevel < 10 ? 'down' : 'neutral';
  const trend = `${trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''} ${Math.random() * 5}% from last week`;

  const isAlert = avgLevel < 10;
  const alertType = avgLevel < 8 ? 'Critical' : 'Warning';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-4 py-16 w-full bg-gradient-to-r from-emerald-500/10 to-green-500/10"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <User className="text-emerald-300" size={32} />
          Farmer Dashboard
        </h2>

        {/* Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Borewell Status"
            value={`${avgLevel} m bgl`}
            icon={<Droplets />}
            trend={trend}
            trendDirection={trendDirection}
          />
          <StatCard
            title="Irrigation Advice"
            value={irrigationAdvice}
            icon={<Waves />}
            trend="Based on current levels"
            trendDirection="neutral"
          />
          <StatCard
            title="Rainfall Prediction"
            value={`${(parseFloat(avgLevel) + 2).toFixed(1)} m bgl next week`}
            icon={<CloudRain />}
            trend="+15% predicted recharge"
            trendDirection="up"
          />
        </div>

        {/* Alert Banner */}
        {isAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border-l-4 ${alertType === 'Critical' ? 'bg-red-500/20 border-red-500' : 'bg-yellow-500/20 border-yellow-500'} text-slate-100`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className={`text-${alertType === 'Critical' ? 'red' : 'yellow'}-300`} size={20} />
              <span className="font-semibold">{alertType} Alert: Groundwater levels are low. Consider conservation measures.</span>
            </div>
          </motion.div>
        )}

        {/* 7-day Trend Chart */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <LineChartIcon size={20} />
            7-Day Water Level Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line type="monotone" dataKey="water_level" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Stations')}
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-slate-100 py-3 px-6 rounded-xl border border-emerald-400/30 transition-all"
          >
            View Detailed Stations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Trends')}
            className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-slate-100 py-3 px-6 rounded-xl border border-emerald-400/30 transition-all"
          >
            Full Trends Analysis
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

const PolicymakerSection = () => {
  const { setCurrentView } = useApp();
  const [policyData, setPolicyData] = useState([]);
  const [avgLevel, setAvgLevel] = useState(0);
  const [rechargePred, setRechargePred] = useState(0);
  const [districtAlerts, setDistrictAlerts] = useState([]);

  React.useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations?role=policymaker');
        let data = [];
        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to mockStations with added districts and status
          data = mockStations.map((station, i) => ({
            ...station,
            district: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'][i % 5],
            status: station.water_level > 10 ? 'normal' : 'critical'
          }));
        }
        setPolicyData(data);
        const avg = data.reduce((sum, s) => sum + (s.water_level || 0), 0) / data.length;
        setAvgLevel(avg.toFixed(1));
        setRechargePred((avg * 0.12).toFixed(1)); // Simulated recharge

        // Group by district for alerts (critical status count)
        const alertsByDistrict = data.reduce((acc, s) => {
          if (s.status === 'critical') {
            acc[s.district] = (acc[s.district] || 0) + 1;
          }
          return acc;
        }, {});
        const alertData = Object.entries(alertsByDistrict).map(([district, count]) => ({ district, alerts: count }));
        setDistrictAlerts(alertData.length > 0 ? alertData : [
          { district: 'Delhi', alerts: 3 },
          { district: 'Mumbai', alerts: 2 },
          { district: 'Bangalore', alerts: 5 },
          { district: 'Chennai', alerts: 1 },
          { district: 'Kolkata', alerts: 4 }
        ]);
      } catch (error) {
        console.error('Error fetching policy data:', error);
        // Fallback
        setPolicyData(mockStations.slice(0, 10));
        setAvgLevel('11.2');
        setRechargePred('1.3');
        setDistrictAlerts([
          { district: 'Delhi', alerts: 3 },
          { district: 'Mumbai', alerts: 2 },
          { district: 'Bangalore', alerts: 5 },
          { district: 'Chennai', alerts: 1 },
          { district: 'Kolkata', alerts: 4 }
        ]);
      }
    };
    fetchPolicyData();
  }, []);

  // Define marker icons
  const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const trend = '+2.5% from last month';
  const trendDirection = 'up';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-4 py-16 w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <Shield className="text-blue-300" size={32} />
          Policy Maker Dashboard
        </h2>

        {/* Aggregated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Average Water Level"
            value={`${avgLevel} m bgl`}
            icon={<Droplets />}
            trend={trend}
            trendDirection={trendDirection}
          />
          <StatCard
            title="Recharge Prediction"
            value={`${rechargePred} Mm³/mo`}
            icon={<TrendingUp />}
            trend="+10% projected"
            trendDirection="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Regional Map */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Regional Station Map
            </h3>
            <MapContainer center={[20, 78]} zoom={5} style={{ height: '300px', borderRadius: '12px' }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {policyData.map((station, i) => (
                <Marker
                  key={i}
                  position={[station.latitude || 20 + (Math.random() - 0.5)*10, station.longitude || 78 + (Math.random() - 0.5)*10]}
                  icon={station.water_level > 10 ? greenIcon : redIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{station.name}</strong><br />
                      Level: {station.water_level} m bgl<br />
                      Status: {station.water_level > 10 ? 'Normal' : 'Critical'}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Alerts by District Chart */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Alerts by District
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtAlerts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="district" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Dashboard')}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-slate-100 py-3 px-6 rounded-xl border border-blue-400/30 transition-all"
          >
            Regional Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Alerts')}
            className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-slate-100 py-3 px-6 rounded-xl border border-blue-400/30 transition-all"
          >
            Manage Alerts
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

const PlannerSection = () => {
  const { setCurrentView } = useApp();
  const [plannerData, setPlannerData] = useState([]);
  const [avgLevel, setAvgLevel] = useState(0);
  const [infrastructureScore, setInfrastructureScore] = useState(0);
  const [stationHealth, setStationHealth] = useState([]);

  React.useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations?role=planner');
        let data = [];
        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to mockStations with added infrastructure status
          data = mockStations.map((station, i) => ({
            ...station,
            infrastructure: ['good', 'maintenance', 'critical'][i % 3],
            status: station.water_level > 10 ? 'operational' : 'needs_attention'
          }));
        }
        setPlannerData(data);
        const avg = data.reduce((sum, s) => sum + (s.water_level || 0), 0) / data.length;
        setAvgLevel(avg.toFixed(1));
        const score = data.filter(s => s.infrastructure === 'good').length / data.length * 100;
        setInfrastructureScore(score.toFixed(0));

        // Group by infrastructure status for health chart
        const healthByStatus = data.reduce((acc, s) => {
          acc[s.infrastructure] = (acc[s.infrastructure] || 0) + 1;
          return acc;
        }, {});
        const healthData = Object.entries(healthByStatus).map(([status, count]) => ({ status, count }));
        setStationHealth(healthData.length > 0 ? healthData : [
          { status: 'good', count: 15 },
          { status: 'maintenance', count: 8 },
          { status: 'critical', count: 3 }
        ]);
      } catch (error) {
        console.error('Error fetching planner data:', error);
        // Fallback
        setPlannerData(mockStations.slice(0, 10));
        setAvgLevel('11.5');
        setInfrastructureScore('75');
        setStationHealth([
          { status: 'good', count: 15 },
          { status: 'maintenance', count: 8 },
          { status: 'critical', count: 3 }
        ]);
      }
    };
    fetchPlannerData();
  }, []);

  // Define marker icons based on infrastructure
  const goodIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const maintenanceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const criticalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getIcon = (infrastructure) => {
    switch (infrastructure) {
      case 'good': return goodIcon;
      case 'maintenance': return maintenanceIcon;
      case 'critical': return criticalIcon;
      default: return goodIcon;
    }
  };

  const trend = '+1.8% from last month';
  const trendDirection = 'up';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-4 py-16 w-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <BookOpen className="text-purple-300" size={32} />
          Planner Dashboard
        </h2>

        {/* Aggregated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Average Water Level"
            value={`${avgLevel} m bgl`}
            icon={<Droplets />}
            trend={trend}
            trendDirection={trendDirection}
          />
          <StatCard
            title="Infrastructure Score"
            value={`${infrastructureScore}%`}
            icon={<GaugeCircle />}
            trend="Good condition"
            trendDirection="neutral"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Infrastructure Map */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Infrastructure Status Map
            </h3>
            <MapContainer center={[20, 78]} zoom={5} style={{ height: '300px', borderRadius: '12px' }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {plannerData.map((station, i) => (
                <Marker
                  key={i}
                  position={[station.latitude || 20 + (Math.random() - 0.5)*10, station.longitude || 78 + (Math.random() - 0.5)*10]}
                  icon={getIcon(station.infrastructure)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{station.name}</strong><br />
                      Infrastructure: {station.infrastructure}<br />
                      Status: {station.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Station Health Chart */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Station Health Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stationHealth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="status" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Maps')}
            className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-slate-100 py-3 px-6 rounded-xl border border-purple-400/30 transition-all"
          >
            View Maps
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Stations')}
            className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-slate-100 py-3 px-6 rounded-xl border border-purple-400/30 transition-all"
          >
            Manage Stations
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Trends')}
            className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-slate-100 py-3 px-6 rounded-xl border border-purple-400/30 transition-all"
          >
            View Insights
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

const StakeholderSection = () => {
  const { setCurrentView } = useApp();
  const [stakeholderData, setStakeholderData] = useState([]);
  const [avgLevel, setAvgLevel] = useState(0);
  const [communityImpact, setCommunityImpact] = useState(0);
  const [publicAlerts, setPublicAlerts] = useState([]);

  React.useEffect(() => {
    const fetchStakeholderData = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations?role=stakeholder');
        let data = [];
        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to mockStations with added community impact and alerts
          data = mockStations.map((station, i) => ({
            ...station,
            community_impact: ['low', 'medium', 'high'][i % 3],
            alert_type: station.water_level < 10 ? 'scarcity' : 'normal'
          }));
        }
        setStakeholderData(data);
        const avg = data.reduce((sum, s) => sum + (s.water_level || 0), 0) / data.length;
        setAvgLevel(avg.toFixed(1));
        const impact = data.filter(s => s.community_impact === 'high').length / data.length * 100;
        setCommunityImpact(impact.toFixed(0));

        // Group by alert type for public alerts chart
        const alertsByType = data.reduce((acc, s) => {
          if (s.alert_type !== 'normal') {
            acc[s.alert_type] = (acc[s.alert_type] || 0) + 1;
          }
          return acc;
        }, {});
        const alertData = Object.entries(alertsByType).map(([type, count]) => ({ type, count }));
        setPublicAlerts(alertData.length > 0 ? alertData : [
          { type: 'scarcity', count: 8 },
          { type: 'contamination', count: 3 },
          { type: 'flood', count: 2 }
        ]);
      } catch (error) {
        console.error('Error fetching stakeholder data:', error);
        // Fallback
        setStakeholderData(mockStations.slice(0, 10));
        setAvgLevel('11.8');
        setCommunityImpact('65');
        setPublicAlerts([
          { type: 'scarcity', count: 8 },
          { type: 'contamination', count: 3 },
          { type: 'flood', count: 2 }
        ]);
      }
    };
    fetchStakeholderData();
  }, []);

  // Define marker icons based on community impact
  const lowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const mediumIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const highIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getIcon = (impact) => {
    switch (impact) {
      case 'low': return lowIcon;
      case 'medium': return mediumIcon;
      case 'high': return highIcon;
      default: return lowIcon;
    }
  };

  const trend = '+2.1% from last month';
  const trendDirection = 'up';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-4 py-16 w-full bg-gradient-to-r from-orange-500/10 to-red-500/10"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-100 mb-8 flex items-center gap-3">
          <Settings className="text-orange-300" size={32} />
          Stakeholder Dashboard
        </h2>

        {/* Aggregated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Average Water Level"
            value={`${avgLevel} m bgl`}
            icon={<Droplets />}
            trend={trend}
            trendDirection={trendDirection}
          />
          <StatCard
            title="Community Impact Score"
            value={`${communityImpact}%`}
            icon={<GaugeCircle />}
            trend="High impact areas"
            trendDirection="neutral"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resource Mapping */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Community Resource Map
            </h3>
            <MapContainer center={[20, 78]} zoom={5} style={{ height: '300px', borderRadius: '12px' }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stakeholderData.map((station, i) => (
                <Marker
                  key={i}
                  position={[station.latitude || 20 + (Math.random() - 0.5)*10, station.longitude || 78 + (Math.random() - 0.5)*10]}
                  icon={getIcon(station.community_impact)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{station.name}</strong><br />
                      Community Impact: {station.community_impact}<br />
                      Alert Type: {station.alert_type}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Public Alerts Chart */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Public Alerts Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={publicAlerts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Dashboard')}
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-slate-100 py-3 px-6 rounded-xl border border-orange-400/30 transition-all"
          >
            View Impact
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Alerts')}
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-slate-100 py-3 px-6 rounded-xl border border-orange-400/30 transition-all"
          >
            View Alerts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentView('Maps')}
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-slate-100 py-3 px-6 rounded-xl border border-orange-400/30 transition-all"
          >
            View Maps
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

// Landing Page - Underwater Theme
const Landing = () => {
  const { setCurrentView, role, setRole } = useApp();
  const [activeRole, setActiveRole] = useState(null);
  const [stats, setStats] = useState({ avgLevel: 12.0, avgPredicted: 1.5, activeStations: 20 });
  const [chartData, setChartData] = useState([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/stations?role=${role}`);
        if (response.ok) {
          const data = await response.json();
          const avgLevel = data.reduce((sum, s) => sum + (s.water_level || 0), 0) / data.length;
          const avgPredicted = data.reduce((sum, s) => sum + (s.predicted_level || 0), 0) / data.length;
          setStats({
            avgLevel: avgLevel.toFixed(1),
            avgPredicted: avgPredicted.toFixed(1),
            activeStations: data.length
          });
          setChartData(data.slice(0, 10).map(s => ({ name: s.name.split(' ')[0], water_level: s.water_level })));
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    if (role) fetchStats();
  }, [role]);

  // Sync activeRole to context role for data fetching
  React.useEffect(() => {
    if (activeRole) {
      setRole(activeRole);
    }
  }, [activeRole]);

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

              <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-50 mb-6 drop-shadow-lg">
                <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
                  AquaSense
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-slate-100 max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
                Dive deep into sustainable groundwater management with real-time insights
              </p>

              {/* Role Selector */}
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {[
                  { key: 'farmer', icon: <User size={16} />, label: 'Farmer' },
                  { key: 'policymaker', icon: <Shield size={16} />, label: 'Policy Maker' },
                  { key: 'planner', icon: <BookOpen size={16} />, label: 'Planner' },
                  { key: 'stakeholder', icon: <Settings size={16} />, label: 'Stakeholder' },
                ].map((r) => (
                  <motion.button
                    key={r.key}
                    onClick={() => {
                      const newRole = activeRole === r.key ? null : r.key;
                      setActiveRole(newRole);
                      if (newRole) setRole(newRole);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeRole === r.key
                        ? 'bg-cyan-500/30 text-slate-100 border border-cyan-400/50'
                        : 'bg-white/10 text-slate-200 border border-white/20 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {r.icon}
                    {r.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Conditional Content Based on Role Selection */}
        {!activeRole ? (
          <>
            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4"
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
            <motion.section
              className="px-4 pb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto"
              >
                {[
                  {
                    icon: <Radar className="text-cyan-300" size={24} />,
                    title: 'Real-time Monitoring',
                    desc: 'Live DWLR water level updates across India.',
                    view: 'Stations'
                  },
                  {
                    icon: <GaugeCircle className="text-cyan-300" size={24} />,
                    title: 'Recharge Estimates',
                    desc: 'Dynamic recharge insights from trends.',
                    view: 'Dashboard'
                  },
                  {
                    icon: <TrendingUp className="text-blue-300" size={24} />,
                    title: 'Trends & Analytics',
                    desc: 'Clean charts for quick interpretation.',
                    view: 'Trends'
                  },
                  {
                    icon: <MapPin className="text-cyan-300" size={24} />,
                    title: 'Geo Mapping',
                    desc: 'Interactive map with station markers.',
                    view: 'Maps'
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-400/30 text-center"
                    whileHover={{ y: -5, scale: 1.02, boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setCurrentView(feature.view)}
                  >
                    <div className="flex items-center justify-center gap-4 font-bold text-lg text-slate-100 mb-4">
                      {feature.icon}
                      <span>{feature.title}</span>
                    </div>
                    <p className="text-base text-slate-200 leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* Stats Section */}
            <section className="px-4 pb-16 w-full">
              <div className="w-full max-w-7xl mx-auto">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  {[
                    { icon: <Droplets size={24} />, label: 'Avg. Water Level (m bgl)', value: parseFloat(stats.avgLevel) },
                    { icon: <LineChartIcon size={24} />, label: 'Avg. Recharge (Mm³/mo)', value: parseFloat(stats.avgPredicted) },
                    { icon: <MapPin size={24} />, label: 'Active Stations', value: stats.activeStations },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-slate-100 flex items-center gap-6 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-cyan-400/20"
                      whileHover={{ y: -3, scale: 1.02 }}
                      animate={{ boxShadow: ['0 0 0 rgba(34, 211, 238, 0)', '0 0 20px rgba(34, 211, 238, 0.3)', '0 0 0 rgba(34, 211, 238, 0)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    >
                      <div className="p-5 rounded-full bg-white/20 text-white shadow-inner">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-sm uppercase tracking-wide text-slate-200 mb-2">
                          {stat.label}
                        </div>
                        <Counter end={stat.value} className="text-3xl font-bold text-slate-50" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Preview Chart */}
                {chartData.length > 0 && (
                  <motion.div
                    className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                  >
                    <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                      <BarChart3 size={20} />
                      Top Stations Water Levels
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                        <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        />
                        <Bar dataKey="water_level" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </div>
            </section>
          </>
        ) : (
          <motion.section
            key={`role-section-${activeRole}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-16 w-full"
          >
            {activeRole === 'farmer' && <FarmerSection />}
            {activeRole === 'policymaker' && <PolicymakerSection />}
            {activeRole === 'planner' && <PlannerSection />}
            {activeRole === 'stakeholder' && <StakeholderSection />}
          </motion.section>
        )}
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
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'policymaker');

  React.useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

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
    setShowAbout,
    role,
    setRole
  }), [currentView, selectedStation, stations, theme, showAbout, role]);

  // About Modal Component
  const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-md w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyan-100 flex items-center gap-2">
              <Info className="text-emerald-300" size={20} />
              About AquaSense
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4 text-cyan-100">
            <p>
              AquaSense is a comprehensive groundwater monitoring dashboard designed for sustainable water management. 
              It provides real-time insights into water levels, recharge rates, and station status across India.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold text-cyan-50">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Real-time DWLR water level monitoring</li>
                <li>Dynamic recharge estimates and trends</li>
                <li>Interactive geo-mapping of stations</li>
                <li>Alert system for critical conditions</li>
                <li>Historical data analysis and reporting</li>
              </ul>
            </div>
            <p className="text-sm text-cyan-200">
              Built with React, Tailwind CSS, and Framer Motion for a fluid underwater-themed experience.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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
      <div className={`w-full min-h-screen bg-cyan-900 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {renderView()}
        <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      </div>
    </AppContext.Provider>
  );
}

export default App;


