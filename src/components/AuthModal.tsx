import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    await login();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to VIT-Verse
              </h2>
              <p className="text-gray-300">
                Sign in to share your anonymous confessions
              </p>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome size={20} />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
              Your identity remains anonymous. We only use Google to verify you're a real student.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;