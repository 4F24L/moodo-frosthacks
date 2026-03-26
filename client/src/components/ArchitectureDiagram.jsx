import React from 'react';
import { motion } from 'motion/react';
import { Mic, Cpu, Database, LayoutDashboard, BellRing, MessageSquareText } from 'lucide-react';

const ArchitectureDiagram = () => {
  const steps = [
    { id: 1, title: 'Voice Input', icon: Mic, color: 'bg-primary' },
    { id: 2, title: 'Feature Extraction', icon: Cpu, color: 'bg-primary/80', sub: 'Librosa' },
    { id: 3, title: 'Sentiment Analysis', icon: MessageSquareText, color: 'bg-primary/60', sub: 'VADER' },
    { id: 4, title: 'Database', icon: Database, color: 'bg-foreground/80', sub: 'MongoDB' },
    { id: 5, title: 'Dashboard', icon: LayoutDashboard, color: 'bg-primary/40' },
    { id: 6, title: 'Trigger System', icon: BellRing, color: 'bg-destructive' },
  ];

  return (
    <div className="py-8 px-4">
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        {/* Connection Line (Desktop) */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block z-0" />
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative z-10 flex flex-col items-center group"
          >
            <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <step.icon className="text-primary-foreground w-8 h-8" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-bold text-foreground">{step.title}</p>
              {step.sub && <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{step.sub}</p>}
            </div>
            
            {/* Arrow (Mobile) */}
            {index < steps.length - 1 && (
              <div className="md:hidden mt-4 text-muted-foreground">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 10 5 5 5-5"/></svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Data Capture
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Raw audio is captured via Web Audio API. Features like pitch and energy are extracted locally before secure transmission.
          </p>
        </div>
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/60" />
            AI Processing
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sentiment analysis (VADER) and acoustic feature modeling provide a multi-dimensional view of the user's emotional state.
          </p>
        </div>
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Proactive Logic
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The system monitors trends over 5-7 days. Significant downward shifts trigger empathetic interventions and resource suggestions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
