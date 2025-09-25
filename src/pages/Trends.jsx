import React, { useState } from 'react';
import { TrendingUp, Calendar, Filter, HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../App';

const Trends = () => {
  const { stations, setCurrentView } = useApp();
  const [timeRange, setTimeRange] = useState('1y');
  const [chartType, setChartType] = useState('line');

  // Mock data for trends
  const monthlyData = [
    { name: 'Jan', level: 12.5, rainfall: 20, recharge: 15 },
    { name: 'Feb', level: 12.2, rainfall: 25, recharge: 18 },
    { name: 'Mar', level: 11.8, rainfall: 15, recharge: 12 },
    { name: 'Apr', level: 11.5, rainfall: 10, recharge: 8 },
    { name: 'May', level: 11.0, rainfall: 5, recharge: 3 },
    { name: 'Jun', level: 10.8, rainfall: 2, recharge: 1 },
    { name: 'Jul', level: 11.2, rainfall: 30, recharge: 20 },
    { name: 'Aug', level: 11.8, rainfall: 45, recharge: 35 },
    { name: 'Sep', level: 12.3, rainfall: 40, recharge: 30 },
    { name: 'Oct', level: 12.7, rainfall: 30, recharge: 25 },
    { name: 'Nov', level: 12.9, rainfall: 20, recharge: 18 },
    { name: 'Dec', level: 12.8, rainfall: 15, recharge: 12 },
  ];

  const yearlyData = [
    { name: '2018', level: 13.2, rainfall: 280, recharge: 210 },
    { name: '2019', level: 12.8, rainfall: 320, recharge: 240 },
    { name: '2020', level: 12.5, rainfall: 300, recharge: 220 },
    { name: '2021', level: 12.2, rainfall: 280, recharge: 200 },
    { name: '2022', level: 11.9, rainfall: 260, recharge: 190 },
    { name: '2023', level: 11.7, rainfall: 240, recharge: 170 },
    { name: '2024', level: 12.1, rainfall: 290, recharge: 210 },
  ];

  const data = timeRange === '1y' ? monthlyData : yearlyData;

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

      <div className="mb-4 flex-1">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="text-cyan-300" size={24} />
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
              <Calendar size={14} className="inline mr-1" /> Time Range
            </label>
            <div className="flex rounded-lg overflow-hidden border border-white/30">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className={`px-4 py-2 text-sm transition-all duration-300 ${timeRange === '1y'
                  ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30'
                  : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setTimeRange('1y')}
              >
                1 Year
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className={`px-4 py-2 text-sm transition-all duration-300 ${timeRange === '7y'
                  ? 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30'
                  : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setTimeRange('7y')}
              >
                7 Years
              </motion.button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              <Filter size={14} className="inline mr-1" /> Chart Type
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white focus:border-cyan-300 focus:outline-none"
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Water Level {timeRange === '1y' ? 'Monthly' : 'Yearly'} Trend
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
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
                <Line
                  type="monotone"
                  dataKey="level"
                  name="Water Level (m)"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: "#0ea5e9" }}
                />
                <Line
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ fill: "#38bdf8" }}
                />
                <Line
                  type="monotone"
                  dataKey="recharge"
                  name="Recharge (mm)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            ) : chartType === 'bar' ? (
              <BarChart data={data}>
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
                <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#38bdf8" />
                <Bar dataKey="recharge" name="Recharge (mm)" fill="#10b981" />
              </BarChart>
            ) : (
              <AreaChart data={data}>
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
                <Area
                  type="monotone"
                  dataKey="level"
                  name="Water Level (m)"
                  stroke="#0ea5e9"
                  fill="rgba(14,165,233,0.2)"
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  stroke="#38bdf8"
                  fill="rgba(56,189,248,0.2)"
                />
                <Area
                  type="monotone"
                  dataKey="recharge"
                  name="Recharge (mm)"
                  stroke="#10b981"
                  fill="rgba(16,185,129,0.2)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex-1">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">
            Station Comparison
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
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
                {stations.map((station, index) => (
                  <Line
                    key={station.id}
                    data={station.historicalData}
                    type="monotone"
                    dataKey="level"
                    name={station.name}
                    stroke={["#0ea5e9", "#38bdf8", "#10b981"][index % 3]}
                    strokeWidth={2}
                    dot={{ fill: ["#0ea5e9", "#38bdf8", "#10b981"][index % 3] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">
            Seasonal Patterns
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
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
                <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#38bdf8" />
                <Bar dataKey="recharge" name="Recharge (mm)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;