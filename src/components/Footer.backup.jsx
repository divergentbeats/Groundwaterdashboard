import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-900/20 via-emerald-900/10 to-cyan-900/20 border-t border-emerald-800/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-cyan-100 text-sm">
          <span>Made with</span>
          <Heart className="text-red-400" size={16} />
          <span>for sustainable water management</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="text-cyan-100 hover:text-emerald-300 transition-colors">
            <Github size={18} />
          </a>
          <a href="#" className="text-cyan-100 hover:text-emerald-300 transition-colors">
            <Twitter size={18} />
          </a>
          <a href="#" className="text-cyan-100 hover:text-emerald-300 transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
