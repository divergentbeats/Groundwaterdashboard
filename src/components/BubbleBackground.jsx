import React from 'react';
import { motion } from 'framer-motion';

const BubbleBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Main underwater gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900" />

      {/* Water surface effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-300/80 via-cyan-400/60 to-blue-400/40" />

      {/* Deep water effect */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/90 via-blue-700/60 to-blue-500/30" />

      {/* Light rays from surface */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute bg-gradient-to-b from-cyan-200/30 via-cyan-300/10 to-transparent"
            style={{
              width: '2px',
              height: '60%',
              left: `${8 + (i * 8)}%`,
              top: '20%',
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + (i * 0.5),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating bubbles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/20 border border-white/30"
            style={{
              width: 4 + (i % 4) * 2,
              height: 4 + (i % 4) * 2,
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 5) % 80}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 6 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BubbleBackground;