import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Filter, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../App';

const Trends = () => {
  const { setCurrentView } = useApp();
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations');
        if (response.ok) {
          const data = await response.json();
          setStations(data);
          if (data.length > 0) {
            setSelectedStation(data[0].id);
          }
        } else {
          console.error('Failed to fetch stations');
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      const fetchTrends = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/station/${selectedStation}/trends`);
          if (response.ok) {
            const data = await response.json();
            let trends = data.trends;
            // If station 4, fetch live readings and prepend
            if (selectedStation === 4) {
              const liveResponse = await fetch(`http://localhost:5000/station/${selectedStation}/live`);
              if (liveResponse.ok) {
                const liveData = await liveResponse.json();
                // Add live readings to trends, assuming liveData is array of {timestamp, water_level}
                const liveTrends = liveData.map(item => ({
                  date: new Date(item.timestamp).toISOString().split('T')[0],
                  water_level: item.water_level,
                  recharge_estimation: 0 // mock
                }));
                trends = [...liveTrends, ...trends];
              }
            }
            setTrendsData(trends);
          } else {
            console.error('Failed to fetch trends');
          }
        } catch (error) {
          console.error('Error fetching trends:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrends();
    }
  }, [selectedStation]);

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
          <TrendingUp className="text-emerald-300" size={24} />
          Water Level Trends
        </h1>
        <p className="text-cyan-100 text-sm">
          Analyze groundwater level trends and patterns over time
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              <Filter size={14} className="inline mr-1" /> Select Station
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-black focus:border-cyan-300 focus:outline-none"
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(parseInt(e.target.value))}
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      {loading ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6 h-[400px] flex items-center justify-center">
          <div className="text-cyan-100 text-lg">Loading trends...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Water Level Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-cyan-100 mb-4">
              Water Level Trend (Last 30 Days)
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
                    name="Water Level (m)"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: "#0ea5e9" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recharge Estimation Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-cyan-100 mb-4">
              Recharge Estimation (Last 30 Days)
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData}>
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
                  <Area
                    type="monotone"
                    dataKey="recharge_estimation"
                    name="Recharge Estimation"
                    stroke="#10b981"
                    fill="rgba(16,185,129,0.3)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Station Info */}
      {selectedStation && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold text-cyan-100 mb-4">
            Station Details
          </h2>
          {stations.find(s => s.id === selectedStation) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-cyan-200">Current Water Level</div>
                <div className="text-2xl font-bold text-cyan-50">{stations.find(s => s.id === selectedStation).water_level}m</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-cyan-200">Recharge Pattern</div>
                <div className="text-2xl font-bold text-cyan-50 capitalize">{stations.find(s => s.id === selectedStation).recharge_pattern}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-cyan-200">Status</div>
                <div className={`text-2xl font-bold capitalize ${stations.find(s => s.id === selectedStation).status === 'normal' ? 'text-green-400' : stations.find(s => s.id === selectedStation).status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {stations.find(s => s.id === selectedStation).status}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Trends;