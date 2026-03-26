import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Trends from './pages/Trends';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

import { Mic } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('moodo_session');
    if (session) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);

    // Listen for tab changes from other components
    const handleTabChange = (e) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('changeTab', handleTabChange);
    return () => window.removeEventListener('changeTab', handleTabChange);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('moodo_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('moodo_session');
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="pb-12">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trends' && <Trends />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Mic className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="font-bold font-display text-foreground">MOODO</span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">© 2026 MOODO AI. All rights reserved. Privacy First Emotional Monitoring.</p>
          <div className="flex gap-6">
            <button className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Privacy Policy</button>
            <button className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
