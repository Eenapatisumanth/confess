import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-6 tracking-tight">
            VIT-Verse
          </h1>
          <div className="h-1 w-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
        </motion.div>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Your anonymous voice in the VIT community. Share confessions, join communities, 
          and connect with fellow students across all campuses.
        </motion.p>
        
        <motion.button
          onClick={onEnter}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-2xl overflow-hidden"
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center space-x-2">
            <span>Enter VIT-Verse</span>
            <ArrowRight size={20} />
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-500 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPage;