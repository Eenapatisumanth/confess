import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import AuthModal from './components/AuthModal';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('vit-verse-visited');
    if (hasVisited) {
      setShowLanding(false);
    }
  }, []);

  const handleEnterApp = () => {
    localStorage.setItem('vit-verse-visited', 'true');
    setShowLanding(false);
  };

  const handleShowLogin = () => {
    setShowAuthModal(true);
  };
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen transition-colors duration-300">
          <AnimatePresence mode="wait">
            {showLanding ? (
              <LandingPage key="landing" onEnter={handleEnterApp} onLogin={handleShowLogin} />
            ) : (
              <MainApp key="main" />
            )}
          </AnimatePresence>
          
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;