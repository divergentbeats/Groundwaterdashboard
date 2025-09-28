import React, { useState, useEffect } from 'react';
import { ImageIcon, HomeIcon, Droplets, Filter, Calendar, Grid3X3, Table, Download, RefreshCw } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Readings = () => {
  const { setCurrentView, selectedStation, setSelectedStation } = useApp();
  const [stations, setStations] = useState([]);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [liveReading, setLiveReading] = useState(null);
  const readingsPerPage = 6;

  // Derive status from water_level
  const getStatus = (waterLevel) => {
    if (waterLevel < 8) return 'LOW';
    if (waterLevel < 10) return 'EQUIVOCAL';
    return 'NORMAL';
  };

  // Get status color classes
  const getStatusClasses = (status) => {
    switch (status) {
      case 'NORMAL': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
      case 'LOW': return 'bg-red-500/20 text-red-300 border border-red-400/30';
      case 'EQUIVOCAL': return 'bg-amber-500/20 text-amber-300 border border-amber-400/30';
      default: return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
    }
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations');
        if (response.ok) {
          const data = await response.json();
          setStations(data);
          if (data.length > 0 && !selectedStation) {
            setSelectedStation(data[0].id);
          }
        } else {
          setError('Failed to fetch stations');
        }
      } catch (err) {
        setError('Error fetching stations: ' + err.message);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (selectedStation) {
      const fetchReadings = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:5000/station/${selectedStation}/trends`);
          if (response.ok) {
            const { trends } = await response.json();
            // Map to readings format, mock battery
            const mappedReadings = trends.map((item, index) => ({
              id: `r${index + 1}`,
              tag: getStatus(item.water_level),
              time: new Date(item.date).toLocaleString(),
              level: item.water_level,
              battery: item.type === 'live' ? (item.battery || (3.5 + Math.random() * 0.5).toFixed(2)) : (3.5 + Math.random() * 0.5).toFixed(2),
              recharge: item.recharge_estimation
            }));
            setReadings(mappedReadings);

            // Check for live reading (latest within 5 minutes)
            if (trends.length > 0 && trends[0].type === 'live') {
              setLiveReading(mappedReadings[0]);
            } else {
              setLiveReading(null);
            }
          } else {
            setError('Failed to fetch readings');
          }
        } catch (err) {
          setError('Error fetching readings: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchReadings();

      // Set up polling every 30 seconds
      const interval = setInterval(fetchReadings, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedStation]);

  // Apply filters (pure function, no side effects)
  const applyFilters = () => {
    let filtered = [...readings];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.tag === filterStatus);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(r => new Date(r.time) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.time) <= toDate);
    }

    return filtered;
  };

  const filteredReadings = applyFilters();
  const totalPages = Math.ceil(filteredReadings.length / readingsPerPage);
  const paginatedReadings = filteredReadings.slice(
    (currentPage - 1) * readingsPerPage,
    currentPage * readingsPerPage
  );

  const exportToCSV = () => {
    const headers = ['Time', 'Status', 'Water Level (m)', 'Recharge (m)', 'Battery (V)'];
    const csvContent = [
      headers.join(','),
      ...filteredReadings.map(reading => [
        `"${reading.time}"`,
        reading.tag,
        reading.level.toFixed(2),
        reading.recharge.toFixed(2),
        reading.battery
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `readings_station_${selectedStation}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">Loading readings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-red-300 text-lg">{error}</div>
      </div>
    );
  }

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
          <ImageIcon className="text-cyan-300" size={24} />
          Station Readings
        </h1>
        <p className="text-cyan-100 text-sm">
          View historical water level readings from monitoring stations
        </p>
      </div>

      {/* View Toggle and Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('cards')}
            className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md font-medium border transition-all duration-300 ${
              viewMode === 'cards'
                ? 'bg-cyan-500/20 text-cyan-50 border-cyan-400/30'
                : 'bg-white/20 text-cyan-50 border-white/30 hover:bg-white/30'
            }`}
          >
            <Grid3X3 size={16} />
            Cards
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('table')}
            className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md font-medium border transition-all duration-300 ${
              viewMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-50 border-cyan-400/30'
                : 'bg-white/20 text-cyan-50 border-white/30 hover:bg-white/30'
            }`}
          >
            <Table size={16} />
            Table
          </motion.button>
        </div>
        <div className="flex gap-2 items-center">
          {liveReading && (
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <RefreshCw size={14} className="animate-spin" />
              Live data available
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md text-emerald-50 font-medium border border-emerald-400/30 hover:bg-emerald-500/30 transition-all duration-300"
          >
            <Download size={16} />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1 flex items-center gap-1">
              <Filter size={14} /> Select Station
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-black focus:border-cyan-300 focus:outline-none"
              value={selectedStation || ''}
              onChange={(e) => setSelectedStation(parseInt(e.target.value))}
            >
              <option value="">Select a station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1 flex items-center gap-1">
              <Filter size={14} /> Filter by Status
            </label>
            <select
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-black focus:border-cyan-300 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
              <option value="EQUIVOCAL">Equivocal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1 flex items-center gap-1">
              <Calendar size={14} /> From Date
            </label>
            <input
              type="date"
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-cyan-100 focus:border-cyan-300 focus:outline-none"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1 flex items-center gap-1">
              <Calendar size={14} /> To Date
            </label>
            <input
              type="date"
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-cyan-100 focus:border-cyan-300 focus:outline-none"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentPage(1)}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/20 backdrop-blur-md text-cyan-50 font-semibold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Filter size={16} /> Apply Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reading Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {paginatedReadings.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-64 text-cyan-100">
              No readings match the selected filters.
            </div>
          ) : (
            paginatedReadings.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="aspect-video bg-cyan-500/20 rounded-t-2xl overflow-hidden flex items-center justify-center">
                  <Droplets className="text-cyan-300" size={48} />
                </div>
                <div className="p-4">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusClasses(card.tag)}`}>
                    {card.tag}
                  </div>
                  <h3 className="font-semibold text-cyan-100 text-sm mb-2">{card.time}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-cyan-100">
                      Water Level: <span className="font-medium text-cyan-50">{card.level.toFixed(2)}m</span>
                    </div>
                    <div className="text-cyan-100">
                      Recharge: <span className="font-medium text-cyan-50">{card.recharge.toFixed(2)}m</span>
                    </div>
                    <div className="text-cyan-100">
                      Battery: <span className="font-medium text-cyan-50">{card.battery}V</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-cyan-50 font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Water Level (m)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Recharge (m)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Battery (V)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedReadings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-cyan-100">
                      No readings match the selected filters.
                    </td>
                  </tr>
                ) : (
                  paginatedReadings.map((reading, index) => (
                    <motion.tr
                      key={reading.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-cyan-100">{reading.time}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(reading.tag)}`}>
                          {reading.tag}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-cyan-100">{reading.level.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-cyan-100">{reading.recharge.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-cyan-100">{reading.battery}</td>
                      <td className="px-4 py-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="group relative inline-flex items-center px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-cyan-50 text-xs font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          View
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-white/30 bg-white/10 text-cyan-100 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &laquo;
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentPage(page)}
                className={`p-2 rounded-lg border border-white/30 min-w-[2.5rem] text-center transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/30'
                    : 'bg-white/10 text-cyan-100 hover:bg-white/20'
                }`}
              >
                {page}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-white/30 bg-white/10 text-cyan-100 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &raquo;
            </motion.button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Readings;
