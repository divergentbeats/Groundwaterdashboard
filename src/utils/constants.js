/**
 * Application-wide constants for the Groundwater Dashboard
 */

// Mock data for stations
export const mockStations = [
  {
    id: 'st-01',
    name: 'Delhi DWLR Station',
    location: [28.7041, 77.1025],
    currentLevel: 12.5,
    rechargeRate: 1.5,
    historicalData: [
      { name: 'Jan', level: 13.5 },
      { name: 'Feb', level: 13.2 },
      { name: 'Mar', level: 13.0 },
      { name: 'Apr', level: 12.8 },
      { name: 'May', level: 12.5 },
    ],
  },
  {
    id: 'st-02',
    name: 'Mumbai DWLR Station',
    location: [19.076, 72.8777],
    currentLevel: 5.5,
    rechargeRate: 2.1,
    historicalData: [
      { name: 'Jan', level: 6.0 },
      { name: 'Feb', level: 5.8 },
      { name: 'Mar', level: 5.6 },
      { name: 'Apr', level: 5.5 },
      { name: 'May', level: 5.5 },
    ],
  },
  {
    id: 'st-03',
    name: 'Bengaluru DWLR Station',
    location: [12.9716, 77.5946],
    currentLevel: 8.2,
    rechargeRate: 0.8,
    historicalData: [
      { name: 'Jan', level: 7.8 },
      { name: 'Feb', level: 8.0 },
      { name: 'Mar', level: 8.1 },
      { name: 'Apr', level: 8.2 },
      { name: 'May', level: 8.2 },
    ],
  },
];

// Map configuration
export const mapConfig = {
  defaultCenter: [20.5937, 78.9629], // Center of India
  defaultZoom: 5,
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Chart colors
export const chartColors = {
  waterLevel: '#0ea5e9', // sky-500
  rainfall: '#38bdf8', // sky-400
  recharge: '#10b981', // emerald-500
  alert: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
  normal: '#10b981', // emerald-500
};

// Application routes
export const routes = {
  home: 'Home',
  dashboard: 'Dashboard',
  map: 'Map',
  trends: 'Trends',
  stations: 'Stations',
  alerts: 'Alerts',
  readings: 'Readings',
};