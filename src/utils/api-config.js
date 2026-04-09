// API Configuration
// Automatically uses localhost for development, production URL for deployment

export const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_API_URL || 'https://groundwater-api.onrender.com');

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Example usage in components:
// import { getApiUrl } from '../utils/api-config';
// const response = await fetch(getApiUrl('/stations'));
