import React from 'react';
import { Droplets, Home, Info, Moon, Sun } from 'lucide-react';
import { useApp } from '../App';

const Navbar = () => {
  const { currentView, setCurrentView, theme, toggleTheme, setShowAbout } = useApp();
  
  return (
    <header className="w-full bg-gradient-to-r from-cyan-900/30 via-emerald-900/20 to-cyan-900/30 backdrop-blur supports-[backdrop-filter]:bg-cyan-900/20 border-b border-emerald-800/30 sticky top-0 z-30">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="text-emerald-400" size={28} />
          <span className="font-bold text-xl text-white">AquaSense</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700/40 hover:bg-emerald-700/60 text-white transition-all duration-200"
          >
            <Home size={16} className="text-emerald-300" />
            <span className="font-medium">Home</span>
          </button>
          
          <span className="text-sm text-emerald-100 capitalize hidden sm:block">{currentView}</span>
          
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-700/40 hover:bg-emerald-700/60 text-white transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-emerald-300" /> : <Moon size={16} className="text-emerald-300" />}
          </button>
          
          <button
            onClick={() => setShowAbout(true)}
            className="p-1.5 rounded-full bg-emerald-700/40 hover:bg-emerald-700/60 text-white transition-all duration-200"
            aria-label="About"
          >
            <Info size={18} className="text-emerald-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;