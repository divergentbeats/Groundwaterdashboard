/**
 * Helper functions for the Groundwater Dashboard
 */
import L from 'leaflet';

/**
 * Creates a custom station icon for the map
 * @param {string} color - The color of the icon
 * @returns {L.DivIcon} - A Leaflet DivIcon
 */
export const createStationIcon = (color = '#0ea5e9') =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:rgba(14,165,233,0.15);border:2px solid ${color};border-radius:9999px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.69c.14.14 6 6.02 6 10.31A6 6 0 1 1 6 13c0-4.3 5.86-10.17 6-10.31z"></path>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Get water level status based on the level value
 * @param {number} level - The water level
 * @returns {Object} - Status object with label and color
 */
export const getWaterLevelStatus = (level) => {
  if (level < 7) {
    return { label: 'Low', color: '#f59e0b' }; // amber-500
  } else if (level > 15) {
    return { label: 'High', color: '#3b82f6' }; // blue-500
  } else {
    return { label: 'Normal', color: '#10b981' }; // emerald-500
  }
};

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};