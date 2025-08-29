import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Confession } from '../types';

interface UserHistoryProps {
  confessions: Confession[];
}

const UserHistory: React.FC<UserHistoryProps> = ({ confessions }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Sign in to view your history
        </h3>
        <p className="text-gray-300">
          Your confession history is private and only visible to you
        </p>
      </div>
    );
  }

  const userConfessions = confessions.filter(confession => 
    user.confessionHistory?.includes(confession.id) || confession.userId === user.id
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
    <div className="space-y-6">
      {userConfessions.length > 0 ? (
        userConfessions.map((confession, index) => (
          <motion.div
            key={confession.id}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  confession.isGroupFun 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <span className="text-white text-sm font-bold">
                    {user.anonymousName.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">You</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Clock size={12} />
                    <span>{formatTimeAgo(confession.createdAt)}</span>
                    {confession.isGroupFun && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400 font-medium">Group Fun</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-100 leading-relaxed">
                {confession.contentText}
              </p>
              
              {confession.mediaUrl && (
                <div className="rounded-xl overflow-hidden">
                  {confession.mediaType === 'image' ? (
                    <img
                      src={confession.mediaUrl}
                      alt="Your confession media"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={confession.mediaUrl}
                      controls
                      className="w-full h-48 object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2 text-gray-300">
                <Heart size={16} />
                <span className="text-sm">{confession._count.reactions} reactions</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MessageCircle size={16} />
                <span className="text-sm">{confession._count.comments} comments</span>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No confessions yet
          </h3>
          <p className="text-gray-300 mb-6">
            Start sharing your thoughts and they'll appear here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default UserHistory;