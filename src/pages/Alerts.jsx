import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, HomeIcon } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Alerts = () => {
  const { setCurrentView, setSelectedStation } = useApp();
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ total: 0, critical: 0, warning: 0, info: 0, success: 0 });

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/alerts');
        if (response.ok) {
          const data = await response.json();
          // Map backend data to component format
          const mappedAlerts = data.map(alert => ({
            id: alert.id,
            type: alert.type || alert.alert_level,
            title: alert.title,
            message: alert.message,
            time: new Date(alert.time || alert.timestamp).toLocaleString(),
            station: alert.station_name,
            stationId: alert.station_id
          }));
          setAlerts(mappedAlerts);

          // Calculate summary
          const counts = { total: 0, critical: 0, warning: 0, info: 0, success: 0 };
          mappedAlerts.forEach(alert => {
            counts.total++;
            if (alert.type === 'critical') counts.critical++;
            else if (alert.type === 'warning') counts.warning++;
            else if (alert.type === 'info') counts.info++;
            else if (alert.type === 'success') counts.success++;
          });
          setSummary(counts);
        } else {
          setError('Failed to fetch alerts');
        }
      } catch (err) {
        setError('Error fetching alerts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/alerts/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setAlerts(alerts.filter(alert => alert.id !== id));
        // Update summary
        const counts = { ...summary, total: summary.total - 1 };
        if (alerts.find(a => a.id === id)?.type === 'critical') counts.critical--;
        else if (alerts.find(a => a.id === id)?.type === 'warning') counts.warning--;
        else if (alerts.find(a => a.id === id)?.type === 'info') counts.info--;
        else if (alerts.find(a => a.id === id)?.type === 'success') counts.success--;
        setSummary(counts);
      }
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const viewDetails = (alert) => {
    if (alert.stationId) {
      setSelectedStation(alert.stationId);
      setCurrentView('Readings');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    // Time filter logic - adjust for real timestamps
    if (filterTime !== 'all') {
      const alertDate = new Date(alert.time);
      const now = new Date();
      const diffMs = now - alertDate;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (filterTime === '24h' && diffDays > 1) return false;
      if (filterTime === '7d' && diffDays > 7) return false;
      if (filterTime === '30d' && diffDays > 30) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">Loading alerts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-red-300 text-lg">{error}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-cyan-50 font-semibold border border-white/30"
        >
          Retry
        </motion.button>
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
          <Bell className="text-emerald-300" size={24} />
          System Alerts
        </h1>
        <p className="text-cyan-100 text-sm">
          Monitor and manage alerts from all groundwater stations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-cyan-50">{summary.total}</div>
          <div className="text-xs text-cyan-200">Total Alerts</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
          <div className="text-xs text-cyan-200">Critical</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-amber-400">{summary.warning}</div>
          <div className="text-xs text-cyan-200">Warnings</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400">{summary.info + summary.success}</div>
          <div className="text-xs text-cyan-200">Info</div>
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
        {filteredAlerts.length === 0 ? (
          <div className="text-center text-cyan-100 py-8">No alerts match the selected filters.</div>
        ) : (
          filteredAlerts.map(alert => (
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
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => viewDetails(alert)}
                    className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-cyan-50 text-xs font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    View Details
                  </motion.button>
                  {alert.type !== 'info' && alert.type !== 'success' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => resolveAlert(alert.id)}
                      className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-rose-500/20 backdrop-blur-md text-rose-300 text-xs font-medium border border-rose-400/30 hover:bg-rose-500/30 transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Resolve
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
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
