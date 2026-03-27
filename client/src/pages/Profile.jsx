import React, { useEffect } from 'react';
import { Lock, Bell, Database } from 'lucide-react';
import { ProfileHeader } from '../components';
import { SettingsItem } from '../components';
import { PrivacyBanner } from '../components';
import { useAuth, useMood } from '../hooks';
import { formatDate } from '../lib/helpers';

const Profile = () => {
  const { user } = useAuth();
  const { dashboard, getDashboard } = useMood();

  useEffect(() => {
    getDashboard('30d');
  }, [getDashboard]);

  const profileUser = {
    name: user?.name || 'User',
    email: user?.email || '',
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=random`,
    joined: user?.createdAt ? formatDate(user.createdAt) : 'Recently',
    stats: {
      totalRecordings: dashboard?.entries?.length || 0,
      avgMood: dashboard?.averageMood ? dashboard.averageMood.toFixed(1) : '-',
      streak: dashboard?.streak || 0
    }
  };

  const settingsItems = [
    {
      icon: Lock,
      title: 'Password & Authentication',
      description: 'Change password and enable 2FA',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Database,
      title: 'Data & Privacy',
      description: 'Manage your recordings and mood data',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Alerts and trend monitoring settings',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ProfileHeader user={profileUser} />

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{profileUser.stats.totalRecordings}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recordings</p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{profileUser.stats.avgMood}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Mood</p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center space-y-1">
          <p className="text-3xl font-bold font-display text-primary">{profileUser.stats.streak}</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Day Streak</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold font-display text-foreground px-2">Privacy & Security</h3>
        
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
          <div className="divide-y divide-border">
            {settingsItems.map((item, i) => (
              <SettingsItem key={i} {...item} />
            ))}
          </div>
        </div>

        <PrivacyBanner />
      </div>
    </div>
  );
};

export default Profile;
