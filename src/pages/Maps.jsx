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
    <div className="p-4 sm:p-6 w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <MapPin className="text-sky-600" size={24} />
          Station Map
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Interactive map showing all groundwater monitoring stations across India
        </p>
      </div>

      {/* Map Card */}
      <div className={designSystem.cards.container}>
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
                    <h3 className="font-medium text-sm">{station.name}</h3>
                    <div className="text-xs mt-1 text-slate-600">
                      Current Level: {station.currentLevel}m
                    </div>
                    <div className="text-xs text-slate-600">
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
      <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium mb-2 text-slate-800 dark:text-slate-200">Map Legend</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-600"></div>
            <span className="text-xs text-slate-600 dark:text-slate-300">Normal Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-600 dark:text-slate-300">Low Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Maps;