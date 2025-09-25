import React from 'react';
import { ImageIcon, HomeIcon } from 'lucide-react';
import { useApp } from '../App';
import { motion } from 'framer-motion';

const Readings = () => {
  const { setCurrentView } = useApp();
  const cards = [
    { id: 'r1', tag: 'NORMAL', time: 'Sep 25, 2025 2:30 PM', level: 12.46, battery: 3.65, img: 'https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?auto=format&fit=crop&w=1200&q=60' },
    { id: 'r2', tag: 'NORMAL', time: 'Sep 25, 2025 3:00 PM', level: 10.99, battery: 3.57, img: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=60' },
    { id: 'r3', tag: 'EQUIVOCAL', time: 'Sep 25, 2025 3:30 PM', level: 15.43, battery: 3.99, img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60' },
    { id: 'r4', tag: 'NORMAL', time: 'Sep 25, 2025 4:00 PM', level: 11.25, battery: 3.72, img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60' },
    { id: 'r5', tag: 'LOW', time: 'Sep 25, 2025 4:30 PM', level: 7.18, battery: 3.45, img: 'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?auto=format&fit=crop&w=1200&q=60' },
    { id: 'r6', tag: 'NORMAL', time: 'Sep 25, 2025 5:00 PM', level: 9.87, battery: 3.81, img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=60' },
  ];

  return (
    <div className="h-full flex flex-col w-full">
      {/* Back to Home Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView('landing')}
        className="group relative mb-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white font-semibold shadow-xl hover:shadow-2xl border border-white/30 transition-all duration-300 self-start"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <HomeIcon size={18} />
        <span>Back to Home</span>
      </motion.button>

      <div className="mb-4 flex-1">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <ImageIcon className="text-cyan-300" size={24} />
          Station Readings
        </h1>
        <p className="text-cyan-100 text-sm">
          View captured images and readings from monitoring stations
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              Filter by Status
            </label>
            <select className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white focus:border-cyan-300 focus:outline-none">
              <option value="all">All Statuses</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
              <option value="equivocal">Equivocal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-100 mb-1">
              Date Range
            </label>
            <input
              type="date"
              className="rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm text-white focus:border-cyan-300 focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/20 backdrop-blur-md text-white font-semibold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              Apply Filters
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reading Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300"
            whileHover={{ y: -2 }}
          >
            <div className="aspect-video bg-cyan-500/20 rounded-t-2xl overflow-hidden">
              <img
                src={card.img}
                alt={`Reading ${card.id}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                card.tag === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                card.tag === 'LOW' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              }`}>
                {card.tag}
              </div>
              <h3 className="font-semibold text-white">{card.time}</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="text-cyan-100">
                  Water Level: <span className="font-medium text-white">{card.level}m</span>
                </div>
                <div className="text-cyan-100">
                  Battery: <span className="font-medium text-white">{card.battery}V</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="group relative inline-flex items-center px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
          >
            &laquo;
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 min-w-[2.5rem] text-center transition-all duration-300"
          >
            1
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-cyan-500/20 text-cyan-100 border border-cyan-400/30 min-w-[2.5rem] text-center hover:bg-cyan-500/30 transition-all duration-300"
          >
            2
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 min-w-[2.5rem] text-center transition-all duration-300"
          >
            3
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
          >
            &raquo;
          </motion.button>
        </nav>
      </div>
    </div>
  );
};

export default Readings;