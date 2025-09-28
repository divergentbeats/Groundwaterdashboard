/**
 * Application-wide constants for the Groundwater Dashboard
 */

// Stations data matching backend
export const stations = [
  { 
    id: 1, 
    name: 'Delhi DWLR Station', 
    state: 'Delhi', 
    district: 'New Delhi', 
    city: 'Delhi', 
    latitude: 28.7041, 
    longitude: 77.1025,
    location: [28.7041, 77.1025],
    currentLevel: 12.5,
    rechargeRate: '1.2',
    historicalData: [
      { name: 'Jan', level: 11.2 },
      { name: 'Feb', level: 11.8 },
      { name: 'Mar', level: 12.1 },
      { name: 'Apr', level: 12.5 },
      { name: 'May', level: 13.0 },
      { name: 'Jun', level: 12.8 }
    ]
  },
  { 
    id: 2, 
    name: 'Mumbai DWLR Station', 
    state: 'Maharashtra', 
    district: 'Mumbai', 
    city: 'Mumbai', 
    latitude: 19.076, 
    longitude: 72.8777,
    location: [19.076, 72.8777],
    currentLevel: 8.3,
    rechargeRate: '2.1',
    historicalData: [
      { name: 'Jan', level: 7.5 },
      { name: 'Feb', level: 7.9 },
      { name: 'Mar', level: 8.2 },
      { name: 'Apr', level: 8.3 },
      { name: 'May', level: 8.7 },
      { name: 'Jun', level: 8.5 }
    ]
  },
  { 
    id: 3, 
    name: 'Bengaluru DWLR Station', 
    state: 'Karnataka', 
    district: 'Bengaluru', 
    city: 'Bengaluru', 
    latitude: 12.9716, 
    longitude: 77.5946,
    location: [12.9716, 77.5946],
    currentLevel: 15.2,
    rechargeRate: '0.8',
    historicalData: [
      { name: 'Jan', level: 14.0 },
      { name: 'Feb', level: 14.5 },
      { name: 'Mar', level: 15.0 },
      { name: 'Apr', level: 15.2 },
      { name: 'May', level: 15.6 },
      { name: 'Jun', level: 15.4 }
    ]
  },
  { 
    id: 4, 
    name: 'Chennai DWLR Station', 
    state: 'Tamil Nadu', 
    district: 'Chennai', 
    city: 'Chennai', 
    latitude: 13.0827, 
    longitude: 80.2707,
    location: [13.0827, 80.2707],
    currentLevel: 10.1,
    rechargeRate: '1.5',
    historicalData: [
      { name: 'Jan', level: 9.3 },
      { name: 'Feb', level: 9.7 },
      { name: 'Mar', level: 10.0 },
      { name: 'Apr', level: 10.1 },
      { name: 'May', level: 10.4 },
      { name: 'Jun', level: 10.2 }
    ]
  },
  { 
    id: 5, 
    name: 'Kolkata DWLR Station', 
    state: 'West Bengal', 
    district: 'Kolkata', 
    city: 'Kolkata', 
    latitude: 22.5726, 
    longitude: 88.3639,
    location: [22.5726, 88.3639],
    currentLevel: 9.8,
    rechargeRate: '1.8',
    historicalData: [
      { name: 'Jan', level: 9.0 },
      { name: 'Feb', level: 9.4 },
      { name: 'Mar', level: 9.7 },
      { name: 'Apr', level: 9.8 },
      { name: 'May', level: 10.1 },
      { name: 'Jun', level: 9.9 }
    ]
  },
  { 
    id: 6, 
    name: 'Hyderabad DWLR Station', 
    state: 'Telangana', 
    district: 'Hyderabad', 
    city: 'Hyderabad', 
    latitude: 17.3850, 
    longitude: 78.4867,
    location: [17.3850, 78.4867],
    currentLevel: 14.7,
    rechargeRate: '1.0',
    historicalData: [
      { name: 'Jan', level: 13.8 },
      { name: 'Feb', level: 14.2 },
      { name: 'Mar', level: 14.5 },
      { name: 'Apr', level: 14.7 },
      { name: 'May', level: 15.0 },
      { name: 'Jun', level: 14.8 }
    ]
  },
  { 
    id: 7, 
    name: 'Pune DWLR Station', 
    state: 'Maharashtra', 
    district: 'Pune', 
    city: 'Pune', 
    latitude: 18.5204, 
    longitude: 73.8567,
    location: [18.5204, 73.8567],
    currentLevel: 11.4,
    rechargeRate: '1.3',
    historicalData: [
      { name: 'Jan', level: 10.6 },
      { name: 'Feb', level: 11.0 },
      { name: 'Mar', level: 11.3 },
      { name: 'Apr', level: 11.4 },
      { name: 'May', level: 11.7 },
      { name: 'Jun', level: 11.5 }
    ]
  },
  { 
    id: 8, 
    name: 'Ahmedabad DWLR Station', 
    state: 'Gujarat', 
    district: 'Ahmedabad', 
    city: 'Ahmedabad', 
    latitude: 23.0225, 
    longitude: 72.5714,
    location: [23.0225, 72.5714],
    currentLevel: 13.9,
    rechargeRate: '0.9',
    historicalData: [
      { name: 'Jan', level: 13.1 },
      { name: 'Feb', level: 13.5 },
      { name: 'Mar', level: 13.8 },
      { name: 'Apr', level: 13.9 },
      { name: 'May', level: 14.2 },
      { name: 'Jun', level: 14.0 }
    ]
  },
  { 
    id: 9, 
    name: 'Jaipur DWLR Station', 
    state: 'Rajasthan', 
    district: 'Jaipur', 
    city: 'Jaipur', 
    latitude: 26.9124, 
    longitude: 75.7873,
    location: [26.9124, 75.7873],
    currentLevel: 16.2,
    rechargeRate: '0.7',
    historicalData: [
      { name: 'Jan', level: 15.4 },
      { name: 'Feb', level: 15.8 },
      { name: 'Mar', level: 16.1 },
      { name: 'Apr', level: 16.2 },
      { name: 'May', level: 16.5 },
      { name: 'Jun', level: 16.3 }
    ]
  },
  { 
    id: 10, 
    name: 'Lucknow DWLR Station', 
    state: 'Uttar Pradesh', 
    district: 'Lucknow', 
    city: 'Lucknow', 
    latitude: 26.8467, 
    longitude: 80.9462,
    location: [26.8467, 80.9462],
    currentLevel: 7.6,
    rechargeRate: '2.4',
    historicalData: [
      { name: 'Jan', level: 6.8 },
      { name: 'Feb', level: 7.2 },
      { name: 'Mar', level: 7.5 },
      { name: 'Apr', level: 7.6 },
      { name: 'May', level: 7.9 },
      { name: 'Jun', level: 7.7 }
    ]
  },
  { 
    id: 11, 
    name: 'Kanpur DWLR Station', 
    state: 'Uttar Pradesh', 
    district: 'Kanpur', 
    city: 'Kanpur', 
    latitude: 26.4499, 
    longitude: 80.3319,
    location: [26.4499, 80.3319],
    currentLevel: 18.1,
    rechargeRate: '0.5',
    historicalData: [
      { name: 'Jan', level: 17.3 },
      { name: 'Feb', level: 17.7 },
      { name: 'Mar', level: 18.0 },
      { name: 'Apr', level: 18.1 },
      { name: 'May', level: 18.4 },
      { name: 'Jun', level: 18.2 }
    ]
  },
  { 
    id: 12, 
    name: 'Nagpur DWLR Station', 
    state: 'Maharashtra', 
    district: 'Nagpur', 
    city: 'Nagpur', 
    latitude: 21.1458, 
    longitude: 79.0882,
    location: [21.1458, 79.0882],
    currentLevel: 6.9,
    rechargeRate: '2.0',
    historicalData: [
      { name: 'Jan', level: 6.1 },
      { name: 'Feb', level: 6.5 },
      { name: 'Mar', level: 6.8 },
      { name: 'Apr', level: 6.9 },
      { name: 'May', level: 7.2 },
      { name: 'Jun', level: 7.0 }
    ]
  },
  { 
    id: 13, 
    name: 'Indore DWLR Station', 
    state: 'Madhya Pradesh', 
    district: 'Indore', 
    city: 'Indore', 
    latitude: 22.7196, 
    longitude: 75.8577,
    location: [22.7196, 75.8577],
    currentLevel: 19.3,
    rechargeRate: '0.6',
    historicalData: [
      { name: 'Jan', level: 18.5 },
      { name: 'Feb', level: 18.9 },
      { name: 'Mar', level: 19.2 },
      { name: 'Apr', level: 19.3 },
      { name: 'May', level: 19.6 },
      { name: 'Jun', level: 19.4 }
    ]
  },
  { 
    id: 14, 
    name: 'Bhopal DWLR Station', 
    state: 'Madhya Pradesh', 
    district: 'Bhopal', 
    city: 'Bhopal', 
    latitude: 23.2599, 
    longitude: 77.4126,
    location: [23.2599, 77.4126],
    currentLevel: 5.4,
    rechargeRate: '2.6',
    historicalData: [
      { name: 'Jan', level: 4.6 },
      { name: 'Feb', level: 5.0 },
      { name: 'Mar', level: 5.3 },
      { name: 'Apr', level: 5.4 },
      { name: 'May', level: 5.7 },
      { name: 'Jun', level: 5.5 }
    ]
  },
  { 
    id: 15, 
    name: 'Patna DWLR Station', 
    state: 'Bihar', 
    district: 'Patna', 
    city: 'Patna', 
    latitude: 25.5941, 
    longitude: 85.1376,
    location: [25.5941, 85.1376],
    currentLevel: 20.0,
    rechargeRate: '0.4',
    historicalData: [
      { name: 'Jan', level: 19.2 },
      { name: 'Feb', level: 19.6 },
      { name: 'Mar', level: 19.9 },
      { name: 'Apr', level: 20.0 },
      { name: 'May', level: 20.3 },
      { name: 'Jun', level: 20.1 }
    ]
  },
  { 
    id: 16, 
    name: 'Vadodara DWLR Station', 
    state: 'Gujarat', 
    district: 'Vadodara', 
    city: 'Vadodara', 
    latitude: 22.3072, 
    longitude: 73.1812,
    location: [22.3072, 73.1812],
    currentLevel: 4.7,
    rechargeRate: '2.3',
    historicalData: [
      { name: 'Jan', level: 3.9 },
      { name: 'Feb', level: 4.3 },
      { name: 'Mar', level: 4.6 },
      { name: 'Apr', level: 4.7 },
      { name: 'May', level: 5.0 },
      { name: 'Jun', level: 4.8 }
    ]
  },
  { 
    id: 17, 
    name: 'Coimbatore DWLR Station', 
    state: 'Tamil Nadu', 
    district: 'Coimbatore', 
    city: 'Coimbatore', 
    latitude: 11.0168, 
    longitude: 76.9558,
    location: [11.0168, 76.9558],
    currentLevel: 17.8,
    rechargeRate: '0.7',
    historicalData: [
      { name: 'Jan', level: 17.0 },
      { name: 'Feb', level: 17.4 },
      { name: 'Mar', level: 17.7 },
      { name: 'Apr', level: 17.8 },
      { name: 'May', level: 18.1 },
      { name: 'Jun', level: 17.9 }
    ]
  },
  { 
    id: 18, 
    name: 'Kochi DWLR Station', 
    state: 'Kerala', 
    district: 'Ernakulam', 
    city: 'Kochi', 
    latitude: 9.9312, 
    longitude: 76.2673,
    location: [9.9312, 76.2673],
    currentLevel: 3.2,
    rechargeRate: '2.8',
    historicalData: [
      { name: 'Jan', level: 2.4 },
      { name: 'Feb', level: 2.8 },
      { name: 'Mar', level: 3.1 },
      { name: 'Apr', level: 3.2 },
      { name: 'May', level: 3.5 },
      { name: 'Jun', level: 3.3 }
    ]
  },
  { 
    id: 19, 
    name: 'Visakhapatnam DWLR Station', 
    state: 'Andhra Pradesh', 
    district: 'Visakhapatnam', 
    city: 'Visakhapatnam', 
    latitude: 17.6868, 
    longitude: 83.2185,
    location: [17.6868, 83.2185],
    currentLevel: 18.5,
    rechargeRate: '0.5',
    historicalData: [
      { name: 'Jan', level: 17.7 },
      { name: 'Feb', level: 18.1 },
      { name: 'Mar', level: 18.4 },
      { name: 'Apr', level: 18.5 },
      { name: 'May', level: 18.8 },
      { name: 'Jun', level: 18.6 }
    ]
  },
  { 
    id: 20, 
    name: 'Agra DWLR Station', 
    state: 'Uttar Pradesh', 
    district: 'Agra', 
    city: 'Agra', 
    latitude: 27.1767, 
    longitude: 78.0081,
    location: [27.1767, 78.0081],
    currentLevel: 2.9,
    rechargeRate: '2.9',
    historicalData: [
      { name: 'Jan', level: 2.1 },
      { name: 'Feb', level: 2.5 },
      { name: 'Mar', level: 2.8 },
      { name: 'Apr', level: 2.9 },
      { name: 'May', level: 3.2 },
      { name: 'Jun', level: 3.0 }
    ]
  }
];

export const mockStations = stations;

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