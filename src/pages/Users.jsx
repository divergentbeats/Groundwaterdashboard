import React from 'react';
import { motion } from 'framer-motion';
import { UserRound, UserPlus, Search, Filter, HomeIcon } from 'lucide-react';
import { useApp } from '../App';

const Users = () => {
  const { theme, setCurrentView } = useApp();
  
  // Mock user data
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@aquasense.org', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Field Technician', email: 'tech@aquasense.org', role: 'Technician', status: 'Active' },
    { id: 3, name: 'Data Analyst', email: 'analyst@aquasense.org', role: 'Analyst', status: 'Away' },
    { id: 4, name: 'Guest User', email: 'guest@aquasense.org', role: 'Guest', status: 'Inactive' },
  ];

  return (
    <div className="min-h-full flex flex-col w-full">
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex-1"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Users Management</h1>
        <p className="text-cyan-100 opacity-80">Manage user accounts and permissions</p>
      </motion.div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 opacity-70" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-cyan-100/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Filter size={16} />
            <span>Filter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/20 backdrop-blur-md text-white font-semibold border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <UserPlus size={16} />
            <span>Add User</span>
          </motion.button>
        </div>
      </div>

      {/* Users table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden flex-1"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-cyan-100 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="border-b border-white/10 last:border-0"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-700/50 flex items-center justify-center">
                        <UserRound className="text-cyan-300" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-100">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-100">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                      user.status === 'Away' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-cyan-400 hover:text-cyan-300 mr-3"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-cyan-100">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">4</span> users
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-cyan-100 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-all duration-300"
            disabled
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-cyan-100 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transition-all duration-300"
            disabled
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Users;