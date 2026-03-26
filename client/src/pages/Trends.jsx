import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download,
  BrainCircuit,
  HeartPulse,
  Smile
} from 'lucide-react';
import MoodChart from '../components/MoodChart';
import { cn } from '../lib/utils';

const Trends = () => {
  const data = [
    { name: 'Mar 20', score: 8.5 },
    { name: 'Mar 21', score: 7.8 },
    { name: 'Mar 22', score: 8.2 },
    { name: 'Mar 23', score: 6.5 },
    { name: 'Mar 24', score: 5.2 },
    { name: 'Mar 25', score: 4.8 },
    { name: 'Mar 26', score: 4.5 },
  ];

  const stats = [
    { label: 'Weekly Average', value: '6.5', icon: BrainCircuit, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Peak Mood', value: '8.5', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lowest Mood', value: '4.5', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Stability', value: 'High', icon: HeartPulse, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-display text-foreground">Emotional Trends</h1>
          <p className="text-muted-foreground">Deep dive into your emotional patterns over time.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`${stat.color} w-6 h-6`} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold font-display text-foreground mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Large Chart */}
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold font-display text-foreground">Mood Progression</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Mood Score</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <MoodChart data={data} />
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-foreground rounded-3xl p-8 text-background space-y-6">
          <h3 className="text-xl font-bold font-display">AI Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-background/10 rounded-2xl border border-background/10 backdrop-blur-sm">
              <p className="font-bold text-primary mb-1">Weekly Summary</p>
              <p className="text-sm text-background/80 leading-relaxed">
                Your mood has been relatively stable, but we noticed a significant dip starting Wednesday. This correlates with your recorded "overwhelmed" sessions.
              </p>
            </div>
            <div className="p-4 bg-background/10 rounded-2xl border border-background/10 backdrop-blur-sm">
              <p className="font-bold text-emerald-300 mb-1">Positive Pattern</p>
              <p className="text-sm text-background/80 leading-relaxed">
                Your mood is consistently 20% higher on mornings when you record before 9 AM. This suggests a positive start-of-day routine.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-6">
          <h3 className="text-xl font-bold font-display text-foreground">Recent Fluctuations</h3>
          <div className="space-y-4">
            {[
              { day: 'Sunday', change: '+0.7', trend: 'up', time: '10:30 AM' },
              { day: 'Saturday', change: '-0.4', trend: 'down', time: '09:15 PM' },
              { day: 'Friday', change: '-0.6', trend: 'down', time: '06:45 PM' },
              { day: 'Thursday', change: '-1.3', trend: 'down', time: '08:00 PM' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                    item.trend === 'up' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {item.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{item.day}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{item.time}</p>
                  </div>
                </div>
                <div className={cn(
                  "font-bold text-lg",
                  item.trend === 'up' ? "text-green-600" : "text-red-600"
                )}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
