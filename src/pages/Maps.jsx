import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Home as HomeIcon } from 'lucide-react';
import { useApp } from '../App';

// Map View Component
const Maps = () => {
  const { setCurrentView } = useApp();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapCenter = [21, 78]; // Center of India

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations');
        if (response.ok) {
          const data = await response.json();
          setStations(data);
        } else {
          console.error('Failed to fetch stations');
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Color-coded icons based on status
  const getIcon = (status) => {
    let color = '#10b981'; // green for normal
    let iconClass = 'normal';

    if (status === 'warning') {
      color = '#f59e0b'; // yellow
      iconClass = 'warning';
    } else if (status === 'critical') {
      color = '#ef4444'; // red
      iconClass = 'critical';
    }

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      className: `leaflet-div-icon ${iconClass}`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col w-full items-center justify-center">
        <div className="text-cyan-100 text-lg">Loading map...</div>
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
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <HomeIcon size={18} />
        <span>Back to Home</span>
      </motion.button>

      <div className="mb-4 flex-1">
        <h1 className="text-2xl font-bold text-cyan-100 mb-2 flex items-center gap-2">
          <MapPin className="text-emerald-300" size={24} />
          Station Map
        </h1>
        <p className="text-emerald-100 text-sm">
          Interactive map showing all groundwater monitoring stations across India
        </p>
      </div>

      {/* Map Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 flex-1">
        <div className="h-[70vh] w-full rounded-xl overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={5}
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
                position={[station.latitude, station.longitude]}
                icon={getIcon(station.status)}
              >
                <Popup>
                  <div className="p-4 min-w-[200px]">
                    <h3 className="font-bold text-lg text-black mb-2">{station.name}</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div>City: {station.city}</div>
                      <div>Current Water Level: {station.water_level}m</div>
                      <div>Recharge Pattern: {station.recharge_pattern}</div>
                      <div>Status: <span className={`capitalize ${station.status === 'normal' ? 'text-green-600' : station.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>{station.status}</span></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mt-4">
        <h3 className="text-sm font-medium mb-2 text-cyan-100">Map Legend</h3>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
            <span className="text-xs text-emerald-200">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-white"></div>
            <span className="text-xs text-emerald-200">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-white"></div>
            <span className="text-xs text-emerald-200">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Maps;