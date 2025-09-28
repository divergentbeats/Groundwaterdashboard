import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Droplets, TrendingUp, BellRing, MapPin, Home as HomeIcon, LineChart as LineChartIcon, BarChart3 } from 'lucide-react';
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
  Bar
} from 'recharts';

const Dashboard = () => {
  const { setCurrentView } = useApp();
  const [stations, setStations] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapCenter = [21, 78]; // Center of India

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations');
        if (response.ok) {
          const data = await response.json();
          setStations(data);
          if (data.length > 0) {
            // Fetch trends for the first station
            const trendsResponse = await fetch(`http://localhost:5000/station/${data[0].id}/trends`);
            if (trendsResponse.ok) {
              const trends = await trendsResponse.json();
              setTrendsData(trends.trends);
            }
          }
        } else {
          console.error('Failed to fetch stations');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Calculate average water level
  const avgWaterLevel = stations.reduce((sum, station) => sum + station.water_level, 0) / stations.length;
  
  // Count critical stations
  const criticalStations = stations.filter(station => station.status === 'critical').length;

  // Combined data for comparison chart
  const comparisonData = stations.map(station => ({
    name: station.name.replace(' DWLR Station', ''),
    level: station.water_level,
    status: station.status
  }));

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
          title="Active Stations" 
          value={`${stations.length} stations`} 
          icon={<MapPin className="text-emerald-300" />}
          trend="No change from last month"
          trendDirection="neutral"
        />
        <StatCard 
          title="Critical Alerts" 
          value={`${criticalStations} stations`} 
          icon={<BellRing className="text-red-300" />}
          trend="No change from last month"
          trendDirection="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 w-full">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold mb-4 text-cyan-100 flex items-center gap-2">
              <LineChartIcon size={18} className="text-cyan-300" />
              Water Level Trends (First Station)
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.1)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'rgb(224 242 254)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="water_level" 
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
            <h2 className="text-lg font-semibold mb-4 text-cyan-100 flex items-center gap-2">
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
                {stations.map((station) => {
                  // Simple color based on status
                  const getIcon = (status) => {
                    let color = '#10b981'; // green
                    if (status === 'warning') color = '#f59e0b';
                    if (status === 'critical') color = '#ef4444';
                    return L.divIcon({
                      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6],
                    });
                  };

                  return (
                    <Marker
                      key={station.id}
                      position={[station.latitude, station.longitude]}
                      icon={getIcon(station.status)}
                    >
                      <Popup>
                        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                          <h3 className="font-semibold text-sm text-cyan-100">{station.name}</h3>
                          <div className="text-xs mt-1 text-cyan-100">
                            Water Level: {station.water_level}m
                          </div>
                          <div className="text-xs text-cyan-100">
                            Status: {station.status}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="mt-6 w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold mb-4 text-cyan-100 flex items-center gap-2">
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
                      color: 'rgb(224 242 254)'
                    }} 
                  />
                <Bar dataKey="level" name="Water Level (m)" fill="#0ea5e9" />
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