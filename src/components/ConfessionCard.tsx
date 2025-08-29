import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, MoreHorizontal, Flag, Clock } from 'lucide-react';
import { Confession, ReactionType } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ConfessionCardProps {
  confession: Confession;
  onReact: (confessionId: string, reactionType: ReactionType) => void;
  onComment: (confessionId: string, comment: string) => void;
}

const reactionEmojis: Record<ReactionType, string> = {
  love: '❤️',
  haha: '😂',
  wow: '🤯',
  sad: '😢',
  angry: '😠'
};

const campusColors: Record<string, string> = {
  vellore: 'bg-blue-500',
  chennai: 'bg-green-500',
  bhopal: 'bg-purple-500',
  ap: 'bg-red-500'
};

const campusNames: Record<string, string> = {
  vellore: 'VIT Vellore',
  chennai: 'VIT Chennai',
  bhopal: 'VIT Bhopal',
  ap: 'VIT-AP'
};

const ConfessionCard: React.FC<ConfessionCardProps> = ({ confession, onReact, onComment }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactions, setShowReactions] = useState(false);

  const handleReact = (reactionType: ReactionType) => {
    if (user) {
      onReact(confession.id, reactionType);
      setShowReactions(false);
    }
  };

  const handleComment = () => {
    if (user && commentText.trim()) {
      onComment(confession.id, commentText.trim());
      setCommentText('');
    }
  };

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
    <motion.div
      className={`rounded-2xl shadow-lg overflow-hidden backdrop-blur-md border transition-all duration-300 ${
        confession.isGroupFun 
          ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30 hover:bg-purple-500/20' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Community Badge */}
      {confession.isGroupFun && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 text-center">
          🌐 COMMUNITY
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              confession.isGroupFun 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              <span className="text-white text-sm font-bold">
                {confession.user.anonymousName.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white">
                {confession.user.anonymousName}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock size={12} />
                <span>{formatTimeAgo(confession.createdAt)}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${campusColors[confession.campus]}`}>
                  {campusNames[confession.campus]}
                </span>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {confession.contentText && (
            <p className="text-gray-100 leading-relaxed">
              {confession.contentText}
            </p>
          )}
          
          {confession.mediaUrl && (
            <div className="rounded-xl overflow-hidden">
              {confession.mediaType === 'image' ? (
                <img
                  src={confession.mediaUrl}
                  alt="Confession media"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <video
                  src={confession.mediaUrl}
                  controls
                  className="w-full h-64 object-cover"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <Heart size={18} />
                <span className="text-sm font-medium">{confession._count.reactions}</span>
              </button>
              
              <AnimatePresence>
                {showReactions && (
                  <motion.div
                    className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 p-2 flex space-x-1"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Object.entries(reactionEmojis).map(([type, emoji]) => (
                      <button
                        key={type}
                        onClick={() => handleReact(type as ReactionType)}
                        className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">{confession._count.comments}</span>
            </button>
          </div>
          
          <button className="text-gray-400 hover:text-red-400 transition-colors">
            <Flag size={16} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            className="border-t border-white/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Comment Input */}
              {user && (
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.anonymousName.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your thoughts anonymously..."
                      className="w-full p-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-md text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={2}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3">
                {confession.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {comment.user.anonymousName.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-white">
                            {comment.user.anonymousName}
                          </span>
                          <span className="text-xs text-gray-300">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200">
                          {comment.commentText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConfessionCard;