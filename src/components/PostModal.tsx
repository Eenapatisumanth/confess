import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Video, MapPin, Upload, Users } from 'lucide-react';
import { Campus } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, campus: Campus, mediaFile?: File, isGroupFun?: boolean) => void;
  isGroupFun?: boolean;
}

const campusOptions = [
  { value: 'vellore', label: 'VIT Vellore' },
  { value: 'chennai', label: 'VIT Chennai' },
  { value: 'bhopal', label: 'VIT Bhopal' },
  { value: 'ap', label: 'VIT-AP' },
];

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit, isGroupFun = false }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<Campus>('vellore');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = () => {
    if (content.trim() && selectedCampus) {
      onSubmit(
        content.trim(),
        selectedCampus,
        mediaFile || undefined,
        isGroupFun
      );
      setContent('');
      setMediaFile(null);
      onClose();
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setMediaFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
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
            className="relative bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {isGroupFun && <Users className="text-purple-400" size={24} />}
                <h2 className="text-xl font-bold text-white">
                  {isGroupFun ? 'Create Community Post' : 'Share Your Confession'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isGroupFun 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <span className="text-white text-sm font-bold">
                      {user.anonymousName.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {user.anonymousName}
                    </p>
                    <p className="text-sm text-gray-300">
                      Posting anonymously
                    </p>
                  </div>
                </div>
              )}

              {/* Content Input */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isGroupFun 
                  ? "What community activity or topic do you want to share? Describe the event, discussion, or idea..."
                  : "What's on your mind? Share your thoughts, experiences, or confessions anonymously..."
                }
                className="w-full p-4 border border-white/20 rounded-xl bg-white/5 backdrop-blur-md text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[120px]"
                rows={6}
              />

              {/* Media Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  dragOver 
                    ? 'border-blue-400 bg-blue-500/10' 
                    : 'border-white/30 hover:border-white/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {mediaFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <Upload size={20} />
                      <span className="font-medium">{mediaFile.name}</span>
                    </div>
                    <button
                      onClick={() => setMediaFile(null)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="mx-auto text-gray-400" size={32} />
                    <div>
                      <p className="text-white font-medium">Drop files here or click to upload</p>
                      <p className="text-gray-400 text-sm">Images and videos supported</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>

              {/* Campus Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Select Campus
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {campusOptions.map((campus) => (
                    <label
                      key={campus.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedCampus === campus.value
                          ? 'border-blue-400 bg-blue-500/20'
                          : 'border-white/20 hover:border-blue-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="campus"
                        value={campus.value}
                        checked={selectedCampus === campus.value}
                        onChange={(e) => setSelectedCampus(e.target.value as Campus)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-white">
                        {campus.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300">
                  {content.length}/1000
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || content.length > 1000}
                  className={`px-6 py-2 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed ${
                    isGroupFun
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600'
                  }`}
                >
                  {isGroupFun ? 'Post to Community' : 'Post Anonymously'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;