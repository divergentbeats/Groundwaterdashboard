import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Droplets, TrendingUp, BellRing, MapPin, Home as HomeIcon, LineChart as LineChartIcon, BarChart3, CloudRain, Leaf, AlertTriangle, Download, Settings, Users, Shield, BookOpen } from 'lucide-react';
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const FarmerDashboard = ({ data, setCurrentView, userLocation }) => {
  const trendData = data.trend ? data.trend.map((level, i) => ({
    day: `Day ${i + 1}`,
    water_level: level
  })) : [];

  const isAlert = data.alerts && data.alerts.some(alert => alert.includes('critical'));
  const alertType = data.alerts && data.alerts.some(alert => alert.includes('critical')) ? 'Critical' : 'Warning';

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

      <h1 className="text-3xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
        <Users className="text-emerald-300" size={32} />
        Farmer Dashboard
      </h1>

      {/* Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Borewell Status"
          value={`${data.currentLevel || 'N/A'} m bgl`}
          icon={<Droplets />}
          trend="Based on nearest station"
          trendDirection="neutral"
        />
        <StatCard
          title="Irrigation Advice"
          value={data.advice || 'Loading...'}
          icon={<CloudRain />}
          trend={`${data.precipitation || 0}mm expected`}
          trendDirection="up"
        />
        <StatCard
          title="Nearest Station"
          value={data.stationName || 'Unknown'}
          icon={<MapPin />}
          trend="Auto-detected"
          trendDirection="neutral"
        />
      </div>

      {/* Alert Banner */}
      {isAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl border-l-4 ${alertType === 'Critical' ? 'bg-red-500/20 border-red-500' : 'bg-yellow-500/20 border-yellow-500'} text-cyan-100`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className={`text-${alertType === 'Critical' ? 'red' : 'yellow'}-300`} size={20} />
            <span className="font-semibold">{alertType} Alert: {data.alerts.join(', ')}</span>
          </div>
        </motion.div>
      )}

      {/* Crop Insights */}
      {data.cropInsights && data.cropInsights.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <Leaf size={20} />
            Crop Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.cropInsights.map((insight, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-cyan-100">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-day Trend Chart */}
      {trendData.length > 0 && (
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <LineChartIcon size={20} />
            7-Day Water Level Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Stations')}
          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-emerald-400/30 transition-all"
        >
          View Detailed Stations
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Trends')}
          className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-emerald-400/30 transition-all"
        >
          Full Trends Analysis
        </motion.button>
      </div>
    </div>
  );
};

const PolicymakerDashboard = ({ data, setCurrentView }) => {
  const regionalTrends = data.regionalTrends || [];
  const rechargeForecast = data.rechargeForecast || [];
  const alertSummary = data.alertSummary || [];
  const stationsStatus = data.stationsStatus || [];

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

      <h1 className="text-3xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
        <Shield className="text-blue-300" size={32} />
        Policy Maker Dashboard
      </h1>

      {/* Aggregated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Average Water Level"
          value={`${regionalTrends.length > 0 ? (regionalTrends.reduce((sum, r) => sum + r.avg_level, 0) / regionalTrends.length).toFixed(1) : 'N/A'} m bgl`}
          icon={<Droplets />}
          trend="Regional average"
          trendDirection="neutral"
        />
        <StatCard
          title="Recharge Forecast"
          value={`${rechargeForecast.length > 0 ? rechargeForecast[rechargeForecast.length - 1] : 'N/A'} Mm³/mo`}
          icon={<TrendingUp />}
          trend="Projected increase"
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
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Regional Station Map
          </h3>
          <MapContainer center={[20, 78]} zoom={5} style={{ height: '300px', borderRadius: '12px' }} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stationsStatus.map((station, i) => (
              <Marker
                key={i}
                position={[station.latitude || 20 + (Math.random() - 0.5)*10, station.longitude || 78 + (Math.random() - 0.5)*10]}
                icon={station.status === 'critical' ? redIcon : greenIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{station.name}</strong><br />
                    Status: {station.status || 'normal'}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Alerts by Region Chart */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Alerts by Region
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertSummary} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="state" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Alerts')}
          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-blue-400/30 transition-all"
        >
          Manage Alerts
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Maps')}
          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-blue-400/30 transition-all"
        >
          View Regional Maps
        </motion.button>
      </div>
    </div>
  );
};

const PlannerDashboard = ({ data, setCurrentView }) => {
  const [scenario, setScenario] = React.useState('normal');
  const [scenarioData, setScenarioData] = React.useState(data);

  const handleScenarioChange = async (newScenario) => {
    setScenario(newScenario);
    // Fetch scenario data
    try {
      const response = await fetch(`http://localhost:5000/dashboard/planner?scenario=${newScenario}`);
      if (response.ok) {
        const newData = await response.json();
        setScenarioData(newData);
      }
    } catch (error) {
      console.error('Error fetching scenario data:', error);
    }
  };

  const historicalTrend = scenarioData.historicalTrend || [];
  const simulatedTrend = scenarioData.simulatedTrend || [];
  const availabilityForecast = scenarioData.availabilityForecast || [];

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

      <h1 className="text-3xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
        <BookOpen className="text-purple-300" size={32} />
        Planner Dashboard
      </h1>

      {/* Scenario Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-cyan-100 mb-4">Scenario Modeling</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'normal', label: 'Normal Conditions', desc: 'Standard rainfall and extraction' },
            { key: 'drought', label: 'Drought Scenario', desc: '30% less rainfall' },
            { key: 'heavy_rainfall', label: 'Heavy Rainfall', desc: '50% more rainfall' }
          ].map((s) => (
            <motion.button
              key={s.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScenarioChange(s.key)}
              className={`p-4 rounded-xl border transition-all ${
                scenario === s.key
                  ? 'bg-purple-500/30 border-purple-400 text-cyan-100'
                  : 'bg-white/10 border-white/20 text-cyan-200 hover:bg-white/20'
              }`}
            >
              <div className="font-semibold">{s.label}</div>
              <div className="text-sm opacity-80">{s.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scenario Description */}
      <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
        <p className="text-cyan-100">{scenarioData.scenarioDescription || 'Select a scenario to view projections'}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Historical vs Simulated Trend */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <LineChartIcon size={20} />
            Trend Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <YAxis stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line dataKey="level" data={historicalTrend.map((level, i) => ({ day: i, level }))} type="monotone" stroke="#22d3ee" strokeWidth={2} name="Historical" />
              <Line dataKey="level" data={simulatedTrend.map((level, i) => ({ day: i, level }))} type="monotone" stroke="#a855f7" strokeWidth={2} name="Simulated" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 30-Day Availability Forecast */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            30-Day Availability Forecast
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={availabilityForecast.map((level, i) => ({ day: i + 1, level }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Area type="monotone" dataKey="level" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Stations')}
          className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-purple-400/30 transition-all"
        >
          Manage Stations
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Trends')}
          className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-purple-400/30 transition-all"
        >
          View Detailed Trends
        </motion.button>
      </div>
    </div>
  );
};

const StakeholderDashboard = ({ data, setCurrentView }) => {
  const stations = data.stations || [];
  const monthlyAlerts = data.monthlyAlerts || [];

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

      <h1 className="text-3xl font-bold text-cyan-100 mb-6 flex items-center gap-3">
        <Settings className="text-orange-300" size={32} />
        Stakeholder Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Stations"
          value={`${stations.length}`}
          icon={<MapPin />}
          trend="Active monitoring"
          trendDirection="neutral"
        />
        <StatCard
          title="Average Level"
          value={`${stations.length > 0 ? (stations.reduce((sum, s) => sum + (s.avg_level || 0), 0) / stations.length).toFixed(1) : 'N/A'} m bgl`}
          icon={<Droplets />}
          trend="Current average"
          trendDirection="neutral"
        />
        <StatCard
          title="Critical Stations"
          value={`${stations.filter(s => s.latest_alert === 'critical').length}`}
          icon={<AlertTriangle />}
          trend="Require attention"
          trendDirection="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Alerts Chart */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Monthly Alerts Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyAlerts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" tick={{ fill: 'rgba(255,255,255,0.8)' }} />
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

        {/* Export Options */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center gap-2">
            <Download size={20} />
            Data Export
          </h3>
          <div className="space-y-4">
            {['CSV', 'JSON', 'XLSX'].map((format) => (
              <motion.button
                key={format}
                whileHover={{ scale: 1.02 }}
                className="w-full p-3 bg-orange-500/20 hover:bg-orange-500/30 text-cyan-100 rounded-lg border border-orange-400/30 transition-all flex items-center gap-3"
              >
                <Download size={16} />
                Export as {format}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Stations')}
          className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-orange-400/30 transition-all"
        >
          View All Stations
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setCurrentView('Alerts')}
          className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-cyan-100 py-3 px-6 rounded-xl border border-orange-400/30 transition-all"
        >
          View Alerts History
        </motion.button>
      </div>
    </div>
  );
};

const GenericDashboard = ({ data, setCurrentView }) => {
  // Fallback generic dashboard
  return (
    <div className="h-full flex flex-col w-full">
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

      <div className="text-center text-cyan-100">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Role-specific dashboard content not available.</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { setCurrentView, role } = useApp();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapCenter = [21, 78]; // Center of India

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let url = `http://localhost:5000/dashboard/${role}`;

        if (role === 'farmer') {
          // Get user location for farmer dashboard
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setUserLocation({ lat, lon });

                const response = await fetch(`${url}?lat=${lat}&lon=${lon}`);
                if (response.ok) {
                  const data = await response.json();
                  setDashboardData(data);
                } else {
                  console.error('Failed to fetch farmer dashboard');
                }
                setLoading(false);
              },
              (error) => {
                console.error('Geolocation error:', error);
                setLocationError('Unable to get your location. Please enable location services.');
                setLoading(false);
              }
            );
          } else {
            setLocationError('Geolocation is not supported by this browser.');
            setLoading(false);
          }
        } else {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            console.error('Failed to fetch dashboard data');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (role) {
      fetchDashboardData();
    }
  }, [role]);

  if (loading) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-red-300 text-lg mb-4">{locationError}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('landing')}
          className="px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-cyan-50 font-semibold shadow-xl hover:shadow-2xl border border-white/30"
        >
          Back to Home
        </motion.button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">No data available</div>
      </div>
    );
  }

  // Role-based rendering
  if (role === 'farmer') {
    return <FarmerDashboard data={dashboardData} setCurrentView={setCurrentView} userLocation={userLocation} />;
  } else if (role === 'policymaker') {
    return <PolicymakerDashboard data={dashboardData} setCurrentView={setCurrentView} />;
  } else if (role === 'planner') {
    return <PlannerDashboard data={dashboardData} setCurrentView={setCurrentView} />;
  } else if (['stakeholder', 'researcher', 'ngo'].includes(role)) {
    return <StakeholderDashboard data={dashboardData} setCurrentView={setCurrentView} />;
  }

  // Fallback to generic dashboard
  return <GenericDashboard data={dashboardData} setCurrentView={setCurrentView} />;
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
            <p className="text-2xl font-bold text-cyan-50">{value}</p>
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