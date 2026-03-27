import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Users, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface RegistrationData {
  date: string;
  count: number;
}

interface UserRegistrationGraphProps {
  data: RegistrationData[];
  total?: number;
  average?: number;
  peak?: number;
  growthPercentage?: number;
}

export default function UserRegistrationGraph({ data, total, average, peak, growthPercentage }: UserRegistrationGraphProps) {
  // Calculate stats from data if not provided
  const calculatedTotal = total ?? data.reduce((sum, d) => sum + d.count, 0);
  const calculatedAverage = average ?? (data.length > 0 ? calculatedTotal / data.length : 0);
  const calculatedPeak = peak ?? (data.length > 0 ? Math.max(...data.map(d => d.count)) : 0);
  const calculatedGrowth = growthPercentage ?? 0;

  return (
    <div className="premium-card p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">New User Registrations</h3>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Daily growth over the last 7 days</p>
          </div>
        </div>
        {calculatedGrowth !== 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            calculatedGrowth > 0 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            <TrendingUp className={`w-3.5 h-3.5 ${calculatedGrowth < 0 ? 'rotate-180' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {calculatedGrowth > 0 ? '+' : ''}{calculatedGrowth.toFixed(1)}% Growth
            </span>
          </div>
        )}
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(str) => format(parseISO(str), 'MMM dd')}
              dy={10}
            />
            <YAxis 
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
                        {format(parseISO(payload[0].payload.date), 'MMMM dd, yyyy')}
                      </p>
                      <p className="text-sm font-black text-orange-600">
                        {payload[0].value} New Users
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#ea580c" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-lg font-black text-slate-900 tracking-tighter">{calculatedTotal}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average</p>
          <p className="text-lg font-black text-slate-900 tracking-tighter">{calculatedAverage.toFixed(1)}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Peak</p>
          <p className="text-lg font-black text-slate-900 tracking-tighter">{calculatedPeak}</p>
        </div>
      </div>
    </div>
  );
}
