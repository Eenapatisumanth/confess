import React from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onEnter: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onLogin }) => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Login Button */}
      <motion.button
        onClick={onLogin}
        className="absolute top-8 right-8 flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 text-white font-medium rounded-full hover:bg-opacity-20 transition-all duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogIn size={18} />
        <span>{user ? `Welcome, ${user.anonymousName}` : 'Sign In'}</span>
      </motion.button>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400 bg-opacity-20 rounded-full"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
            VIT-Verse
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-8 rounded-full"></div>
        </motion.div>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Your anonymous voice in the VIT community. Share, connect, and discover stories that matter.
        </motion.p>
        
        <motion.button
          onClick={onEnter}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-2xl overflow-hidden"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Enter VIT-Verse</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100"
            initial={false}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LandingPage;