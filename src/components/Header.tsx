import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, MessageSquare, FileText, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentSection: 'confessions' | 'communities';
  onSectionChange: (section: 'confessions' | 'communities') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowMyConfessions: () => void;
  onShowChats: () => void;
  onShowAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentSection,
  onSectionChange,
  searchQuery,
  onSearchChange,
  onShowMyConfessions,
  onShowChats,
  onShowAuth,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-white">VIT-Verse</h1>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => onSectionChange('confessions')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentSection === 'confessions'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Confessions
              </button>
              <button
                onClick={() => onSectionChange('communities')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentSection === 'communities'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Communities
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${currentSection}...`}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={onShowMyConfessions}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FileText size={18} />
                  <span className="hidden md:inline">My Confessions</span>
                </button>
                
                <button
                  onClick={onShowChats}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MessageSquare size={18} />
                  <span className="hidden md:inline">Chats</span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.anonymousName.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <User size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onShowAuth}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;