import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Bell, 
  Eye, 
  Database,
  Smartphone,
  ChevronRight,
  Settings
} from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'Nitish Singha',
    email: 'nitishsingha829@gmail.com',
    avatar: 'https://picsum.photos/seed/nitish/200',
    joined: 'January 2026',
    stats: {
      totalRecordings: 42,
      avgMood: 6.8,
      streak: 5
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-3xl object-cover shadow-xl ring-4 ring-card"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
            <Settings className="w-5 h-5" />
          </div>
        </div>
        <div className="text-center md:text-left space-y-2 flex-1">
          <h1 className="text-3xl font-bold font-display text-foreground">{user.name}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Shield className="w-4 h-4" />
              Pro Member
            </div>
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">Member since {user.joined}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{user.stats.totalRecordings}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recordings</p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{user.stats.avgMood}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Mood</p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{user.stats.streak}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Day Streak</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-display text-foreground px-2">Privacy & Security</h3>
        
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
          <div className="divide-y divide-border">
            <div className="p-6 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Lock className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Password & Authentication</p>
                  <p className="text-xs text-muted-foreground">Change password and enable 2FA</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>

            <div className="p-6 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Database className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Data & Privacy</p>
                  <p className="text-xs text-muted-foreground">Manage your recordings and mood data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>

            <div className="p-6 flex items-center justify-between hover:bg-muted transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Bell className="text-emerald-600 w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Alerts and trend monitoring settings</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h4 className="text-xl font-bold font-display text-foreground">Privacy Guarantee</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Your voice is processed in real-time. We extract emotional features and convert speech to text, but we never store the raw audio files. Your data is encrypted and only used to help you monitor your wellbeing.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Shield className="w-4 h-4 text-primary" />
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Eye className="w-4 h-4 text-primary" />
                Zero-Knowledge
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-5 text-primary">
            <Shield className="w-64 h-64" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
