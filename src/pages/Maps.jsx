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
    const fetchStationsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/stations');
        if (response.ok) {
          const data = await response.json();
          // Fetch live stations
          const liveResponse = await fetch('http://localhost:5000/stations/live');
          let liveStations = [];
          if (liveResponse.ok) {
            liveStations = await liveResponse.json();
          }
          // Merge live data into stations
          let mergedStations = data.map(station => {
            const live = liveStations.find(l => l.station_id === station.id);
            if (live) {
              return {
                ...station,
                water_level: live.current_level,
                isLive: true,
                last_updated: live.last_updated,
                liveData: live
              };
            }
            return { ...station, isLive: false };
          });

          // Fetch latest India-WRIS readings for each station
          const updatedStations = await Promise.all(
            mergedStations.map(async (station) => {
              try {
                const readingsResponse = await fetch(`http://localhost:5000/station/${station.id}/latest_readings`);
                if (readingsResponse.ok) {
                  const readingsData = await readingsResponse.json();
                  const latestReadings = readingsData.latest_readings;
                  if (latestReadings && latestReadings.length > 0) {
                    const latest = latestReadings[0]; // Assuming sorted by newest first
                    return {
                      ...station,
                      water_level: latest.water_level_m,
                      recharge_pattern: latest.recharge_rate_mm_day,
                      status: latest.status,
                      battery: latest.battery,
                      last_updated: latest.timestamp,
                      isLive: true // Mark as live since real data
                    };
                  }
                }
              } catch (error) {
                console.error(`Error fetching readings for station ${station.id}:`, error);
              }
              return station; // Return original if fetch fails
            })
          );

          setStations(updatedStations);
        } else {
          console.error('Failed to fetch stations');
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationsData();

    // Set up polling every 30 seconds for live updates
    const interval = setInterval(fetchStationsData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Color-coded icons based on status, with live indicator
  const getIcon = (status, hasLive) => {
    let color = '#10b981'; // green for normal
    let iconClass = 'normal';

    if (status === 'warning') {
      color = '#f59e0b'; // yellow
      iconClass = 'warning';
    } else if (status === 'critical') {
      color = '#ef4444'; // red
      iconClass = 'critical';
    }

    const pulseClass = hasLive ? 'animate-pulse' : '';
    const liveBorder = hasLive ? 'border-4 border-cyan-300' : 'border-3 border-white';

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; ${liveBorder}; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" class="${pulseClass}"></div>`,
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
                icon={getIcon(station.status, station.isLive)}
              >
                <Popup>
                  <div className="p-4 min-w-[200px]">
                    <h3 className="font-bold text-lg text-black mb-2 flex items-center gap-2">
                      {station.name}
                      {station.liveData && (
                        <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full font-medium">
                          Live Data
                        </span>
                      )}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div>City: {station.city}</div>
                      <div>
                        {station.isLive ? 'Live Water Level' : 'Current Water Level'}: {station.water_level}m
                        {station.isLive && (
                          <span className="text-xs text-gray-500 block">
                            Last updated: {new Date(station.last_updated).toLocaleString()}
                          </span>
                        )}
                      </div>
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