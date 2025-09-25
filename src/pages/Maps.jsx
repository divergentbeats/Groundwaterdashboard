import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Map as MapIcon } from 'lucide-react';
import { useApp } from '../App';
import { designSystem } from '../theme/designSystem';
import { createStationIcon } from '../utils/helpers';
import { mapConfig } from '../utils/constants';

// Map View Component
const Maps = () => {
  const { stations } = useApp();
  const mapCenter = [20.5937, 78.9629]; // Center of India

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
          <MapPin className="text-cyan-300" size={24} />
          Station Map
        </h1>
        <p className="text-cyan-100 text-sm">
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
                position={station.location}
                icon={createStationIcon(
                  station.currentLevel < 8 ? designSystem.colors.warning : designSystem.colors.primary
                )}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-medium text-sm text-white">{station.name}</h3>
                    <div className="text-xs mt-1 text-cyan-200">
                      Current Level: {station.currentLevel}m
                    </div>
                    <div className="text-xs text-cyan-200">
                      Recharge Rate: {station.rechargeRate} mm/day
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
        <h3 className="text-sm font-medium mb-2 text-white">Map Legend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <span className="text-xs text-cyan-200">Normal Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-cyan-200">Low Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Maps;