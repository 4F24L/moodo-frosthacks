/**
 * Admin Overview - Dashboard statistics and charts
 */

import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks';
import QuickStats from '../QuickStats';
import UserRegistrationGraph from '../UserRegistrationGraph';
import UserStatusPieChart from '../UserStatusPieChart';

export default function AdminOverview() {
  const { getSummary, getUserGrowth, getMoodTrend } = useAdmin();
  const [summaryData, setSummaryData] = useState(null);
  const [registrationData, setRegistrationData] = useState([]);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [moodTrendData, setMoodTrendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [summary, growth, mood] = await Promise.all([
          getSummary().catch(err => {
            console.error('Summary error:', err);
            return { totalUsers: 0, activeUsers24h: 0, averageMoodScore: 0, atRiskUsers: 0 };
          }),
          getUserGrowth('7d').catch(err => {
            console.error('Growth error:', err);
            return { data: [] };
          }),
          getMoodTrend('7d').catch(err => {
            console.error('Mood trend error:', err);
            return { data: [] };
          }),
        ]);
        
        setSummaryData(summary);
        setRegistrationData(growth.data || []);
        setRegistrationStats({
          total: growth.total || 0,
          average: growth.average || 0,
          peak: growth.peak || 0,
          growthPercentage: growth.growthPercentage || 0
        });
        setMoodTrendData(mood.data || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setSummaryData({ totalUsers: 0, activeUsers24h: 0, averageMoodScore: 0, atRiskUsers: 0 });
        setRegistrationData([]);
        setRegistrationStats({ total: 0, average: 0, peak: 0, growthPercentage: 0 });
        setMoodTrendData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getSummary, getUserGrowth, getMoodTrend]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalUsers = summaryData?.totalUsers || 0;
  const activeUsers = summaryData?.activeUsers24h || 0;
  const averageMood = summaryData?.averageMoodScore || 0;
  const usersAtRisk = summaryData?.atRiskUsers || 0;

  // Convert mood score to 1-10 display scale
  let averageMoodDisplay;
  if (averageMood >= -1 && averageMood <= 1) {
    averageMoodDisplay = Number((((averageMood + 1) / 2) * 9 + 1).toFixed(1));
  } else if (averageMood >= 1 && averageMood <= 10) {
    averageMoodDisplay = Number(averageMood.toFixed(1));
  } else {
    averageMoodDisplay = Number(averageMood.toFixed(1));
  }

  // Calculate mood distribution
  const calculateMoodDistribution = () => {
    if (!moodTrendData || moodTrendData.length === 0) {
      return { lowMood: 0, goodMood: 0, neutralMood: 0 };
    }

    const latestMoods = moodTrendData.slice(-3);
    const avgRecentMood = latestMoods.reduce((sum, d) => sum + (d.avgMood || 0), 0) / latestMoods.length;

    let lowMood = 0;
    let goodMood = 0;
    let neutralMood = 0;

    if (avgRecentMood < -0.3) {
      lowMood = Math.round(totalUsers * 0.4);
      neutralMood = Math.round(totalUsers * 0.35);
      goodMood = Math.round(totalUsers * 0.25);
    } else if (avgRecentMood > 0.3) {
      goodMood = Math.round(totalUsers * 0.5);
      neutralMood = Math.round(totalUsers * 0.35);
      lowMood = Math.round(totalUsers * 0.15);
    } else {
      neutralMood = Math.round(totalUsers * 0.5);
      goodMood = Math.round(totalUsers * 0.3);
      lowMood = Math.round(totalUsers * 0.2);
    }

    return { lowMood, goodMood, neutralMood };
  };

  const { lowMood, goodMood, neutralMood } = calculateMoodDistribution();

  const pieData = [
    { name: 'Active (24h)', value: activeUsers, color: '#f97316' },
    { name: 'Good Mood', value: goodMood, color: '#10b981' },
    { name: 'Neutral', value: neutralMood, color: '#3b82f6' },
    { name: 'Low Mood', value: lowMood, color: '#f59e0b' },
    { name: 'At Risk', value: usersAtRisk, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <QuickStats 
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        averageMood={averageMoodDisplay}
        usersAtRisk={usersAtRisk}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserRegistrationGraph 
            data={registrationData}
            total={registrationStats?.total}
            average={registrationStats?.average}
            peak={registrationStats?.peak}
            growthPercentage={registrationStats?.growthPercentage}
          />
        </div>
        <div className="lg:col-span-1">
          <UserStatusPieChart data={pieData} />
        </div>
      </div>
    </div>
  );
}
