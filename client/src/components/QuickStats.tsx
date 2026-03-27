import React from 'react';
import { Users, Activity, Heart, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuickStatsProps {
  totalUsers: number;
  activeUsers: number;
  averageMood: number;
  usersAtRisk: number;
}

export default function QuickStats({ totalUsers, activeUsers, averageMood, usersAtRisk }: QuickStatsProps) {
  // Determine mood display format based on scale
  const getMoodDisplay = (score: number) => {
    if (score >= -1 && score <= 1) {
      // Normalized score, convert to 1-10
      return (((score + 1) / 2) * 9 + 1).toFixed(1);
    } else if (score >= 1 && score <= 10) {
      // Already on 1-10 scale
      return score.toFixed(1);
    } else {
      // Unknown scale, show as percentage or raw
      return score.toFixed(1);
    }
  };

  const stats = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50/50',
    },
    {
      label: 'Active (24h)',
      value: activeUsers,
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
    },
    {
      label: 'Avg. Mood Score',
      value: getMoodDisplay(averageMood),
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50/50',
    },
    {
      label: 'At Risk (Low Trend)',
      value: usersAtRisk,
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50/50',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="premium-card p-8 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
          </div>
          <div>
            <p className="micro-label mb-1">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
