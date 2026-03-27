import React from 'react';
import { Flame, Calendar } from 'lucide-react';

const DashboardHeader = ({ streak, date }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-4xl font-bold font-display text-foreground">What's on your mind today?</h1>
        <p className="text-sm md:text-base text-muted-foreground">Take a moment to reflect and log your feelings.</p>
      </div>
      <div className="flex items-center justify-between gap-3 bg-card p-2 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-600 rounded-xl font-bold text-sm">
          <Flame className="w-4 h-4" />
          {streak} Day Streak
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl font-bold text-sm">
          <Calendar className="w-4 h-4" />
          {date}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
