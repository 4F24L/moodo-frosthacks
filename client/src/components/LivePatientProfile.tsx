import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Activity,
  Zap,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Bell,
  Filter,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { Patient, RiskLevel } from '../types';
import { cn, getAnonymousId } from '../lib/utils';
import { formatTime, formatDateTime } from '../lib/helpers';

interface LivePatientProfileProps {
  patient: Patient;
  onBack: () => void;
}

export default function LivePatientProfile({ patient, onBack }: LivePatientProfileProps) {
  const riskColors: Record<RiskLevel, string> = {
    'High': 'bg-red-50 text-red-600 border-red-100',
    'Medium': 'bg-amber-50 text-amber-600 border-amber-100',
    'Low': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const chartData = patient.liveHistory.map((point, i) => ({
    index: i,
    time: formatTime(point.time),
    rawTime: point.time,
    score: point.score
  }));

  const getTrend = () => {
    if (patient.liveHistory.length < 2) return { label: 'Stable', icon: Minus, color: 'text-slate-400' };
    const last = patient.liveHistory[patient.liveHistory.length - 1].score;
    const prev = patient.liveHistory[patient.liveHistory.length - 2].score;
    if (last > prev + 0.1) return { label: 'Improving', icon: TrendingUp, color: 'text-emerald-500' };
    if (last < prev - 0.1) return { label: 'Declining', icon: TrendingDown, color: 'text-red-500' };
    return { label: 'Stable', icon: Minus, color: 'text-slate-400' };
  };

  const trend = getTrend();
  const anonId = getAnonymousId(patient.id);

  // Mock History Data
  const historyData = [
    { id: 1, date: 'Mar 27, 2026', time: '06:14 PM', score: 8.8, label: 'High', source: 'Text', insight: 'i am nitish today i am so happy' },
    { id: 2, date: 'Mar 27, 2026', time: '06:01 PM', score: 8.2, label: 'High', source: 'Text', insight: 'Had a great day todayfor me ' },
    { id: 3, date: 'Mar 27, 2026', time: '06:01 PM', score: 2.2, label: 'Low', source: 'Text', insight: 'i am Feeling stressed about work' },
    { id: 4, date: 'Mar 27, 2026', time: '06:00 PM', score: 8.8, label: 'High', source: 'Text', insight: 'i am nitish today i am so happy ' },
  ];

  const [dateRange, setDateRange] = React.useState('7 Days');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 animate-in fade-in duration-500"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{anonId}</h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider",
                  riskColors[patient.riskLevel]
                )}>
                  {patient.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="space-y-8">
          {/* Filter Bar */}
          <div className="bg-white/50 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter by Range:</span>
            </div>
            <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-xl">
              {['7 Days', '15 Days', '30 Days', '90 Days'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    dateRange === range 
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">SI No</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Date & Time</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Score (0-10)</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Label</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Source</th>
                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Insight / Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyData.map((row) => (
                    <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-slate-400">{row.id}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{row.date}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{row.time}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "inline-flex items-center justify-center w-12 h-7 rounded-lg text-xs font-black border",
                          row.score >= 7 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          row.score >= 4 ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {row.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-600">{row.label}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-emerald-500">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-black tracking-tight">{row.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-500 italic shrink truncate max-w-[300px]">
                          "{row.insight}"
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Mood Progression Graph */}
          <div className="premium-card p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Mood Progression</h3>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Real-time emotional trend analysis</p>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              Time: {formatDateTime(payload[0].payload.rawTime)}
                            </p>
                            <p className="text-sm font-black text-orange-600">
                              Mood Score: {Number(payload[0].value).toFixed(1)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#ea580c" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bold">Average Mood</p>
                <p className="text-lg font-black text-slate-900 tracking-tighter">
                  {(patient.liveHistory.reduce((acc, p) => acc + p.score, 0) / (patient.liveHistory.length || 1)).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-bold">Peak Mood</p>
                <p className="text-lg font-black text-slate-900 tracking-tighter">
                  {Math.max(...patient.liveHistory.map(p => p.score), 0).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-slate-100 text-orange-600 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1 font-bold">Current</p>
                <p className="text-lg font-black tracking-tighter">{patient.currentScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
