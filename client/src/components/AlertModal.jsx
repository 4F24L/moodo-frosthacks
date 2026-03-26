import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Heart, Phone, BookOpen } from 'lucide-react';

const AlertModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-card rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="text-primary w-6 h-6" />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-display text-foreground">
                We noticed a change. Want to check in?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our system detected a slight downward trend in your mood over the last few days. It's completely normal to have ups and downs, but we're here if you need support.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Recommended Resources</p>
              
              <button className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-primary/5 rounded-2xl border border-border hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors">
                  <Heart className="text-primary w-5 h-5 group-hover:text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Campus Counselling</p>
                  <p className="text-xs text-muted-foreground">Free support for students and staff</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-primary/5 rounded-2xl border border-border hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors">
                  <BookOpen className="text-primary w-5 h-5 group-hover:text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">Self-Help Guide</p>
                  <p className="text-xs text-muted-foreground">Practical tips for managing stress</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-primary/5 rounded-2xl border border-border hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors">
                  <Phone className="text-primary w-5 h-5 group-hover:text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">24/7 Crisis Line</p>
                  <p className="text-xs text-muted-foreground">Immediate support when you need it</p>
                </div>
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all"
              >
                I'm okay, thanks
              </button>
              <button className="flex-1 py-4 bg-card border border-border hover:bg-muted text-foreground font-bold rounded-2xl transition-all">
                Talk to AI Bot
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertModal;
