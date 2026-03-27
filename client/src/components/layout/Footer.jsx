import React from 'react';
import { Mic } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img 
          src="/logo1.png" 
          alt="Logo"
          className="w-40"
        />
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          © 2026 MOODO AI. All rights reserved. Privacy First Emotional Monitoring.
        </p>
        <div className="flex gap-6">
          <button className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">
            Privacy Policy
          </button>
          <button className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors">
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
