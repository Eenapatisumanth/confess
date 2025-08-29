import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Campus, Confession, ReactionType } from '../types';
import { mockConfessions } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';
import Header from './Header';
import ConfessionCard from './ConfessionCard';
import PostModal from './PostModal';
import AuthModal from './AuthModal';
import MyConfessions from './MyConfessions';
import ChatSidebar from './ChatSidebar';
import CommunityChat from './CommunityChat';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>(mockConfessions);
  const [currentSection, setCurrentSection] = useState<'confessions' | 'communities'>('confessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMyConfessions, setShowMyConfessions] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  // Filter confessions based on section and search query
  const filteredConfessions = useMemo(() => {
    let filtered = confessions;

    // Filter by section type
    if (currentSection === 'communities') {
      filtered = filtered.filter(confession => confession.isGroupFun);
    } else {
      filtered = filtered.filter(confession => !confession.isGroupFun);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(confession =>
        confession.contentText?.toLowerCase().includes(query) ||
        confession.user.anonymousName.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [confessions, currentSection, searchQuery]);

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
      isGroupFun: isGroupFun || currentSection === 'communities',
      _count: {
        reactions: 0,
        comments: 0
      }
    };

    setConfessions(prev => [newConfession, ...prev]);
  };

  const handleReact = (confessionId: string, reactionType: ReactionType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setConfessions(prev => prev.map(confession => {
      if (confession.id === confessionId) {
        const existingReactionIndex = confession.reactions.findIndex(
          r => r.userId === user.id
        );

        let updatedReactions = [...confession.reactions];
        
        if (existingReactionIndex >= 0) {
          if (confession.reactions[existingReactionIndex].reactionType === reactionType) {
            updatedReactions.splice(existingReactionIndex, 1);
          } else {
            updatedReactions[existingReactionIndex] = {
              ...updatedReactions[existingReactionIndex],
              reactionType
            };
          }
        } else {
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

  const handleDeleteConfession = (confessionId: string) => {
    setConfessions(prev => prev.filter(confession => confession.id !== confessionId));
  };

  const handleJoinCommunity = (confessionId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedCommunity(confessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onShowMyConfessions={() => setShowMyConfessions(true)}
        onShowChats={() => setShowChats(true)}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main className="max-w-4xl mx-auto p-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentSection === 'confessions' ? 'Anonymous Confessions' : 'Community Activities'}
            </h2>
            <p className="text-gray-300">
              {currentSection === 'confessions' 
                ? 'Share your thoughts anonymously with the VIT community'
                : 'Join activities and connect with fellow students'
              }
            </p>
          </div>
          
          <motion.button
            onClick={handleCreatePost}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all ${
              currentSection === 'communities'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>
              {currentSection === 'communities' ? 'Create Activity' : 'New Confession'}
            </span>
          </motion.button>
        </div>

        {/* Content Grid */}
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
                  onJoinCommunity={currentSection === 'communities' ? handleJoinCommunity : undefined}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-8xl mb-6">
                {currentSection === 'communities' ? '🌐' : '📝'}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {searchQuery 
                  ? `No ${currentSection} found` 
                  : currentSection === 'communities' 
                    ? 'No community activities yet' 
                    : 'No confessions yet'
                }
              </h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse all posts' 
                  : currentSection === 'communities' 
                    ? 'Be the first to create a community activity and bring students together!'
                    : 'Be the first to share an anonymous confession with the community!'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreatePost}
                  className={`px-8 py-3 text-white font-semibold rounded-lg transition-all ${
                    currentSection === 'communities'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {currentSection === 'communities' ? 'Create First Activity' : 'Share First Confession'}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleSubmitPost}
        isGroupFun={currentSection === 'communities'}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <MyConfessions
        isOpen={showMyConfessions}
        onClose={() => setShowMyConfessions(false)}
        confessions={confessions}
        onDeleteConfession={handleDeleteConfession}
      />

      <ChatSidebar
        isOpen={showChats}
        onClose={() => setShowChats(false)}
      />

      {selectedCommunity && (
        <CommunityChat
          confessionId={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
    </div>
  );
};

export default MainApp;