import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Activity, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, darkMode, setDarkMode } = useTheme();

  const themes = [
    { id: 'ocean', label: 'Ocean Breeze', color: 'bg-blue-500' },
    { id: 'sunset', label: 'Sunset Glow', color: 'bg-orange-500' },
    { id: 'forest', label: 'Forest Deep', color: 'bg-green-600' },
    { id: 'midnight', label: 'Midnight Purple', color: 'bg-indigo-600' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-foreground">MOODO</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-foreground transition-colors outline-none">
                <Palette className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {themes.map((t) => (
                    <DropdownMenuItem 
                      key={t.id} 
                      onClick={() => setTheme(t.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={cn("w-3 h-3 rounded-full", t.color)} />
                      <span className={cn(theme === t.id && "font-bold text-primary")}>{t.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
            </button>
            <div className="h-8 w-px bg-border mx-2" />
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-base font-medium",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.label}
                </button>
              ))}
              
              <div className="py-2 border-t border-border mt-2">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Themes</p>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                        theme === t.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full", t.color)} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2 border-t border-border">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-muted"
                >
                  {darkMode ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>

              <button 
                onClick={onLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
