import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  // Mock chat data
  const chats: Chat[] = [
    {
      id: '1',
      name: 'VIT Vellore General',
      lastMessage: 'Anyone up for late night cricket?',
      timestamp: '2m ago',
      unread: 3,
      isGroup: true
    },
    {
      id: '2',
      name: 'Curious Owl',
      lastMessage: 'Thanks for the study notes!',
      timestamp: '1h ago',
      unread: 1,
      isGroup: false
    },
    {
      id: '3',
      name: 'Study Group - CSE',
      lastMessage: 'Quiz tomorrow at 9 AM',
      timestamp: '3h ago',
      unread: 0,
      isGroup: true
    }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle message sending logic here
      setMessageText('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative w-96 h-full bg-black/80 backdrop-blur-md border-r border-white/20 flex flex-col"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Chats</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex">
              {/* Chat List */}
              <div className="w-full border-r border-white/10">
                <div className="p-4 space-y-2">
                  {chats.map((chat) => (
                    <motion.button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedChat === chat.id
                          ? 'bg-blue-500/20 border border-blue-400/30'
                          : 'hover:bg-white/10'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {chat.isGroup ? (
                            <Users size={16} className="text-purple-400" />
                          ) : (
                            <MessageCircle size={16} className="text-blue-400" />
                          )}
                          <span className="font-medium text-white text-sm">
                            {chat.name}
                          </span>
                        </div>
                        {chat.unread > 0 && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-xs truncate">
                        {chat.lastMessage}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {chat.timestamp}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              {selectedChat && (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-semibold text-white">
                      {chats.find(c => c.id === selectedChat)?.name}
                    </h3>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="bg-blue-500/20 p-3 rounded-lg max-w-xs">
                        <p className="text-white text-sm">Hey everyone!</p>
                        <p className="text-gray-300 text-xs mt-1">2m ago</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg max-w-xs ml-auto">
                        <p className="text-white text-sm">What's up?</p>
                        <p className="text-gray-300 text-xs mt-1">1m ago</p>
                      </div>
                    </div>
                  </div>
                  
                  {user && (
                    <div className="p-4 border-t border-white/10">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatSidebar;