import React from 'react';
import { Home, Info } from 'lucide-react';
import { useApp } from '../App';

const Navbar = () => {
  const { setCurrentView, setShowAbout } = useApp();

  return (
    <nav className="bg-cyan-900/95 backdrop-blur-sm border-b border-cyan-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-white font-bold text-lg">AquaSense</span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors duration-200"
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 text-cyan-100 hover:text-white transition-colors duration-200"
          >
            <Info size={18} />
            <span>About</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
