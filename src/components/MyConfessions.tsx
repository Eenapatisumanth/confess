import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Confession } from '../types';

interface MyConfessionsProps {
  isOpen: boolean;
  onClose: () => void;
  confessions: Confession[];
  onDeleteConfession: (id: string) => void;
}

const MyConfessions: React.FC<MyConfessionsProps> = ({ 
  isOpen, 
  onClose, 
  confessions,
  onDeleteConfession 
}) => {
  const { user } = useAuth();

  const userConfessions = confessions.filter(confession => 
    confession.userId === user?.id
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">My Confessions</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 h-full overflow-y-auto">
              {userConfessions.length > 0 ? (
                <div className="space-y-4">
                  {userConfessions.map((confession) => (
                    <motion.div
                      key={confession.id}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <Clock size={14} />
                          <span>{formatTimeAgo(confession.createdAt)}</span>
                          {confession.isGroupFun && (
                            <>
                              <span>•</span>
                              <span className="text-purple-400 font-medium">Community</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteConfession(confession.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <p className="text-gray-100 mb-3 leading-relaxed">
                        {confession.contentText}
                      </p>
                      
                      {confession.mediaUrl && (
                        <div className="rounded-lg overflow-hidden mb-3">
                          {confession.mediaType === 'image' ? (
                            <img
                              src={confession.mediaUrl}
                              alt="Confession media"
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <video
                              src={confession.mediaUrl}
                              controls
                              className="w-full h-32 object-cover"
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{confession._count.reactions}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={14} />
                          <span>{confession._count.comments}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No confessions yet
                  </h3>
                  <p className="text-gray-300">
                    Start sharing your thoughts and they'll appear here
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MyConfessions;