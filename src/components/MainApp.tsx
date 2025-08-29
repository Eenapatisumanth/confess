import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Campus, Confession, ReactionType } from '../types';
import { mockConfessions } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './Sidebar';
import ConfessionCard from './ConfessionCard';
import PostModal from './PostModal';
import AuthModal from './AuthModal';
import UserHistory from './UserHistory';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>(mockConfessions);
  const [selectedCampus, setSelectedCampus] = useState<Campus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'groupfun' | 'history'>('feed');

  // Filter confessions based on campus and search query
  const filteredConfessions = useMemo(() => {
    let filtered = confessions;

    // Filter by view type
    if (currentView === 'groupfun') {
      filtered = filtered.filter(confession => confession.isGroupFun);
    } else if (currentView === 'feed') {
      filtered = filtered.filter(confession => !confession.isGroupFun);
    }

    // Filter by campus
    if (selectedCampus !== 'all') {
      filtered = filtered.filter(confession => confession.campus === selectedCampus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(confession =>
        confession.contentText?.toLowerCase().includes(query) ||
        confession.user.anonymousName.toLowerCase().includes(query)
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [confessions, selectedCampus, searchQuery, currentView]);

  const handleCreatePost = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowPostModal(true);
  };

  const handleSubmitPost = (
    content: string,
    campus: Campus,
    mediaFile?: File,
    isGroupFun?: boolean
  ) => {
    if (!user) return;

    // Create object URL for file preview
    const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : undefined;
    const mediaType = mediaFile ? (mediaFile.type.startsWith('image/') ? 'image' : 'video') as 'image' | 'video' : undefined;

    const newConfession: Confession = {
      id: uuidv4(),
      userId: user.id,
      user,
      contentText: content,
      mediaUrl,
      mediaType,
      mediaFile,
      campus,
      createdAt: new Date().toISOString(),
      reactions: [],
      comments: [],
      isGroupFun: isGroupFun || false,
      _count: {
        reactions: 0,
        comments: 0
      }
    };

    setConfessions(prev => [newConfession, ...prev]);
    
    // Add to user's history
    if (user.confessionHistory) {
      user.confessionHistory.push(newConfession.id);
    }
  };

  const handleReact = (confessionId: string, reactionType: ReactionType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setConfessions(prev => prev.map(confession => {
      if (confession.id === confessionId) {
        // Check if user already reacted
        const existingReactionIndex = confession.reactions.findIndex(
          r => r.userId === user.id
        );

        let updatedReactions = [...confession.reactions];
        
        if (existingReactionIndex >= 0) {
          // Update existing reaction or remove if same type
          if (confession.reactions[existingReactionIndex].reactionType === reactionType) {
            updatedReactions.splice(existingReactionIndex, 1);
          } else {
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              reactionType
            };
          }
        } else {
          // Add new reaction
          updatedReactions.push({
            id: uuidv4(),
            confessionId,
            userId: user.id,
            reactionType
          });
        }

        return {
          ...confession,
          reactions: updatedReactions,
          _count: {
            ...confession._count,
            reactions: updatedReactions.length
          }
        };
      }
      return confession;
    }));
  };

  const handleComment = (confessionId: string, commentText: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setConfessions(prev => prev.map(confession => {
      if (confession.id === confessionId) {
        const newComment = {
          id: uuidv4(),
          confessionId,
          userId: user.id,
          user,
          commentText,
          createdAt: new Date().toISOString()
        };

        return {
          ...confession,
          comments: [newComment, ...confession.comments],
          _count: {
            ...confession._count,
            comments: confession._count.comments + 1
          }
        };
      }
      return confession;
    }));
  };

  const getViewTitle = () => {
    if (currentView === 'groupfun') {
      return selectedCampus === 'all' ? 'Communities' : `${campusNames[selectedCampus]} Communities`;
    } else if (currentView === 'history') {
      return 'My Confession History';
    }
    return selectedCampus === 'all' ? 'All Confessions' : `${campusNames[selectedCampus]} Confessions`;
  };

  const campusNames: Record<string, string> = {
    vellore: 'VIT Vellore',
    chennai: 'VIT Chennai',
    bhopal: 'VIT Bhopal',
    ap: 'VIT-AP'
  };
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <Sidebar
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        onCreatePost={handleCreatePost}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getViewTitle()}
              </motion.h2>
              <p className="text-gray-300">
                {currentView === 'history' 
                  ? `${user?.confessionHistory?.length || 0} confession${(user?.confessionHistory?.length || 0) !== 1 ? 's' : ''} in your history`
                  : `${filteredConfessions.length} ${currentView === 'groupfun' ? 'communit' + (filteredConfessions.length !== 1 ? 'ies' : 'y') : 'confession' + (filteredConfessions.length !== 1 ? 's' : '')} found`
                }
              </p>
            </div>

            {/* Content Area */}
            {currentView === 'history' ? (
              <UserHistory confessions={confessions} />
            ) : (
              <div className="space-y-6">
                {filteredConfessions.length > 0 ? (
                  filteredConfessions.map((confession, index) => (
                    <motion.div
                      key={confession.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ConfessionCard
                        confession={confession}
                        onReact={handleReact}
                        onComment={handleComment}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-6xl mb-4">
                      {currentView === 'groupfun' ? '🌐' : '📝'}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {currentView === 'groupfun' ? 'No community posts found' : 'No confessions found'}
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {searchQuery 
                        ? 'Try adjusting your search terms' 
                        : currentView === 'groupfun' 
                          ? 'Be the first to post in a community!' 
                          : 'Be the first to share a confession!'
                      }
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={handleCreatePost}
                        className={`px-6 py-3 text-white font-semibold rounded-lg transition-all ${
                          currentView === 'groupfun'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        }`}
                      >
                        {currentView === 'groupfun' ? 'Create Community Post' : 'Share Your Story'}
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleSubmitPost}
        isGroupFun={currentView === 'groupfun'}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default MainApp;