import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

interface CommunityChatProps {
  confessionId: string;
  onClose: () => void;
}

const CommunityChat: React.FC<CommunityChatProps> = ({ confessionId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Brave Eagle',
      message: 'Count me in! What time are we meeting?',
      timestamp: '5m ago'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Swift Panda',
      message: 'I can bring some snacks for everyone!',
      timestamp: '3m ago'
    }
  ]);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!user || !messageText.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      userId: user.id,
      userName: user.anonymousName,
      message: messageText.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <motion.div
          className="relative bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl h-[70vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <Users className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-white">Community Chat</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.userId === user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-100'
                }`}>
                  {message.userId !== user?.id && (
                    <p className="text-xs text-gray-300 mb-1 font-medium">
                      {message.userName}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          {user ? (
            <div className="p-6 border-t border-white/10">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 border-t border-white/10 text-center">
              <p className="text-gray-300 mb-4">Sign in to join the conversation</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommunityChat;