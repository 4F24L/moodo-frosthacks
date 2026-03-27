import React from 'react';
import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

const AuthFooter = () => {
  return (
    <footer className="relative z-10 py-12 bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img 
          src="/logo1.png" 
          alt="Logo"
          className="w-30"
        />
        </div>
        
        <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium">
          <motion.button whileHover={{ color: "var(--primary)" }} className="transition-colors">
            Developed by unknownDevs{"()"} | Frosthacks S02
          </motion.button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © 2026 MOODO AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AuthFooter;
