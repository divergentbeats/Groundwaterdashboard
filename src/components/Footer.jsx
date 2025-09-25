import React from 'react';
import { Droplets } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-900/30 via-emerald-900/20 to-cyan-900/30 border-t border-emerald-800/30 py-4 px-6">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          <Droplets className="text-emerald-400" size={18} />
          <span className="text-white font-medium">AquaSense</span>
          <span className="text-emerald-200 text-sm ml-2">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-emerald-200 hover:text-emerald-100 text-sm transition-colors">Privacy</a>
          <a href="#" className="text-emerald-200 hover:text-emerald-100 text-sm transition-colors">Terms</a>
          <a href="#" className="text-emerald-200 hover:text-emerald-100 text-sm transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;