import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';

function App() {
  const [showLanding, setShowLanding] = useState(true);

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

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <AnimatePresence mode="wait">
            {showLanding ? (
              <LandingPage key="landing" onEnter={handleEnterApp} />
            ) : (
              <MainApp key="main" />
            )}
          </AnimatePresence>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;