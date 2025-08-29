import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, User, Moon, Sun, LogOut, Users, History } from 'lucide-react';
import { Campus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  selectedCampus: Campus | 'all';
  onCampusChange: (campus: Campus | 'all') => void;
  onCreatePost: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: 'feed' | 'groupfun' | 'history';
  onViewChange: (view: 'feed' | 'groupfun' | 'history') => void;
}

const campusOptions = [
  { value: 'all', label: 'All Campuses', color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { value: 'vellore', label: 'VIT Vellore', color: 'bg-blue-500' },
  { value: 'chennai', label: 'VIT Chennai', color: 'bg-green-500' },
  { value: 'bhopal', label: 'VIT Bhopal', color: 'bg-purple-500' },
  { value: 'ap', label: 'VIT-AP', color: 'bg-red-500' },
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedCampus,
  onCampusChange,
  onCreatePost,
  searchQuery,
  onSearchChange,
  currentView,
  onViewChange,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-80 h-full bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2">
          VIT-Verse
        </h1>
        {user && (
          <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user.anonymousName.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">
                {user.anonymousName}
              </p>
              <p className="text-xs text-gray-300">
                Anonymous User
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6 space-y-6">
        {/* Section Toggle */}
        <div className="space-y-2">
          <button
            onClick={() => onViewChange('feed')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'feed'
                ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-400'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Home size={20} />
            <span>Confessions</span>
          </button>
          
          <button
            onClick={() => onViewChange('groupfun')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'groupfun'
                ? 'bg-purple-500/20 text-purple-300 border-l-4 border-purple-400'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Users size={20} />
            <span>Communities</span>
          </button>
          
          {user && (
            <button
              onClick={() => onViewChange('history')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                currentView === 'history'
                  ? 'bg-green-500/20 text-green-300 border-l-4 border-green-400'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <History size={20} />
              <span>My History</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Search confessions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Create Post Button */}
        <motion.button
          onClick={onCreatePost}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusCircle size={20} />
          <span>
            {currentView === 'groupfun' ? 'New Community Post' : 'New Confession'}
          </span>
        </motion.button>

        {/* Campus Filters */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            Campus Filter
          </h3>
          <div className="space-y-2">
            {campusOptions.map((campus) => (
              <motion.button
                key={campus.value}
                onClick={() => onCampusChange(campus.value as Campus | 'all')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedCampus === campus.value
                    ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-400'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${campus.color}`} />
                  <span className="font-medium">{campus.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-white/10 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
        </button>
        
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;