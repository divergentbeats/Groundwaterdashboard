// Design System extracted from homepage
// This file contains all the design tokens used throughout the application

export const designSystem = {
  // Color Palette
  colors: {
    // Primary blues for water theme
    primary: {
      50: '#e0f7ff',
      100: '#b8eaff',
      200: '#8dd8ff',
      300: '#5ec5ff',
      400: '#38b2fc',
      500: '#0ea5e9', // Main brand color
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Slate for UI elements
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Underwater gradient colors
    underwater: {
      surface: 'from-cyan-300/80 via-cyan-400/60 to-blue-400/40',
      deep: 'from-blue-900/90 via-blue-700/60 to-blue-500/30',
      main: 'from-cyan-400 via-blue-500 to-blue-900',
    },
    // Functional colors
    functional: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },
  
  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  
  // Borders & Shadows
  borders: {
    radius: {
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    width: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
    }
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  
  // Animations & Transitions
  animations: {
    bubble: {
      duration: {
        slow: '6s',
        medium: '4s',
        fast: '2s',
      },
      ease: 'easeInOut',
    },
    waterRay: {
      duration: '4s',
      ease: 'easeInOut',
    },
    transition: {
      DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  
  // Card Styling
  cards: {
    default: {
      background: 'bg-white dark:bg-slate-800',
      border: 'border border-slate-200 dark:border-slate-700',
      shadow: 'shadow-md',
      radius: 'rounded-lg',
      padding: 'p-4',
    },
    hover: {
      shadow: 'shadow-lg',
      transform: 'translate-y-[-2px]',
      transition: 'transition-all duration-300',
    }
  },
  
  // Button Styling
  buttons: {
    primary: {
      base: 'inline-flex items-center justify-center rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 ring-sky-500 transition-colors',
      default: 'bg-sky-500 hover:bg-sky-600 text-white',
      sizes: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-2',
      }
    },
    secondary: {
      base: 'inline-flex items-center justify-center rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 ring-sky-500 transition-colors',
      default: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
      sizes: {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-2',
      }
    }
  }
};

export default designSystem;