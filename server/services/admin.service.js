import User from "../models/User.js";
import Mood from "../models/Mood.js";

/**
 * Get summary statistics for admin dashboard
 */
export const getSummaryStats = async () => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Total users count
  const totalUsers = await User.countDocuments();

  // Active users in last 24h (users with mood entries)
  const activeUsers24h = await Mood.distinct("user", {
    createdAt: { $gte: last24h }
  }).then(users => users.length);

  // Average mood score over last 7 days
  const avgMoodResult = await Mood.aggregate([
    { $match: { createdAt: { $gte: last7d } } },
    { $group: { _id: null, avgMood: { $avg: "$moodScore" } } }
  ]);
  const averageMoodScore = avgMoodResult.length > 0 
    ? Number(avgMoodResult[0].avgMood.toFixed(2)) 
    : 0;

  // At-risk users count
  const atRiskUsers = await getAtRiskUsersCount();

  return {
    totalUsers,
    activeUsers24h,
    averageMoodScore,
    atRiskUsers
  };
};

/**
 * Get user registration growth data
 */
export const getUserGrowthData = async (days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];

  const results = await User.aggregate(pipeline);

  // Fill in missing dates with zero counts
  const data = [];
  const dateMap = new Map(results.map(r => [r._id, r.count]));
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    });
  }

  const counts = data.map(d => d.count);
  const total = counts.reduce((sum, c) => sum + c, 0);
  const average = total > 0 ? Number((total / days).toFixed(2)) : 0;
  const peak = counts.length > 0 ? Math.max(...counts) : 0;

  // Growth percentage (compare first and last day)
  const firstDay = counts[0] || 0;
  const lastDay = counts[counts.length - 1] || 0;
  const growthPercentage = firstDay > 0 
    ? Number((((lastDay - firstDay) / firstDay) * 100).toFixed(2))
    : 0;

  return {
    data,
    total,
    average,
    peak,
    growthPercentage
  };
};

/**
 * Get mood trend data over time
 */
export const getMoodTrendData = async (days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        avgMood: { $avg: "$moodScore" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];

  const results = await Mood.aggregate(pipeline);

  // Fill in missing dates
  const data = [];
  const dateMap = new Map(results.map(r => [r._id, Number(r.avgMood.toFixed(2))]));
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      avgMood: dateMap.get(dateStr) || 0
    });
  }

  // Detect overall trend using linear regression slope
  const overallTrend = detectTrend(data.map(d => d.avgMood));

  return {
    data,
    overallTrend
  };
};

/**
 * Get list of at-risk users
 */
export const getAtRiskUsers = async () => {
  const users = await User.find({}, '_id').lean();
  const atRiskList = [];

  // First, determine the scale of mood scores by sampling
  const sampleMood = await Mood.findOne().select('moodScore').lean();
  const isNormalizedScale = sampleMood && sampleMood.moodScore >= -1 && sampleMood.moodScore <= 1;
  
  // Set threshold based on scale
  const lowMoodThreshold = isNormalizedScale ? -0.3 : 5; // -0.3 for normalized, 5 for 1-10+ scale

  for (const user of users) {
    const recentMoods = await Mood.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('moodScore')
      .lean();

    if (recentMoods.length === 0) continue;

    const scores = recentMoods.map(m => m.moodScore).reverse();
    const avgMood = Number((scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2));
    const trend = detectTrend(scores);

    // User is at risk if:
    // 1. Downward trend in last 5 entries, OR
    // 2. Average mood below threshold (scale-dependent)
    if (trend === "downward" || avgMood < lowMoodThreshold) {
      atRiskList.push({
        userId: user._id,
        averageMood: avgMood,
        trend
      });
    }
  }

  return atRiskList;
};

/**
 * Helper: Get count of at-risk users
 */
const getAtRiskUsersCount = async () => {
  const atRiskList = await getAtRiskUsers();
  return atRiskList.length;
};

/**
 * Get all users with their mood data
 */
export const getAllUsers = async () => {
  const users = await User.find({}, '_id name email createdAt').lean();
  const usersWithMood = [];

  for (const user of users) {
    const recentMoods = await Mood.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('moodScore createdAt')
      .lean();

    let currentScore = 5;
    let status = 'Stable';
    let riskLevel = 'Low';
    let lastUpdate = 'Never';

    if (recentMoods.length > 0) {
      const latestMood = recentMoods[0];
      const scores = recentMoods.map(m => m.moodScore);
      const avgMood = scores.reduce((sum, s) => sum + s, 0) / scores.length;

      // Normalize score to 1-10 scale
      if (latestMood.moodScore >= -1 && latestMood.moodScore <= 1) {
        currentScore = Number((((latestMood.moodScore + 1) / 2) * 9 + 1).toFixed(1));
      } else {
        currentScore = Number(latestMood.moodScore.toFixed(1));
      }

      // Determine risk level and status
      if (currentScore <= 3) {
        riskLevel = 'High';
        status = 'High Risk';
      } else if (currentScore <= 5) {
        riskLevel = 'Medium';
        status = 'Needs Attention';
      } else if (currentScore <= 7) {
        riskLevel = 'Low';
        status = 'Stable';
      } else {
        riskLevel = 'Low';
        status = 'Stable';
      }

      // Format last update
      const timeDiff = Date.now() - new Date(latestMood.createdAt).getTime();
      const minutes = Math.floor(timeDiff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) lastUpdate = `${days}d ago`;
      else if (hours > 0) lastUpdate = `${hours}h ago`;
      else if (minutes > 0) lastUpdate = `${minutes}m ago`;
      else lastUpdate = 'Just now';
    }

    usersWithMood.push({
      id: user._id.toString(),
      name: user.name || 'Anonymous',
      age: 0, // Age not stored in User model
      currentScore,
      status,
      riskLevel,
      lastUpdate,
      liveHistory: recentMoods.map(m => ({
        time: new Date(m.createdAt).toISOString(),
        score: m.moodScore
      }))
    });
  }

  return usersWithMood;
};

/**
 * Helper: Detect trend from array of values
 * Returns "upward", "downward", or "stable"
 */
const detectTrend = (values) => {
  if (values.length < 2) return "stable";

  // Check if strictly increasing or decreasing
  let increasing = true;
  let decreasing = true;

  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) increasing = false;
    if (values[i] >= values[i - 1]) decreasing = false;
  }

  if (decreasing) return "downward";
  if (increasing) return "upward";

  // Use simple linear regression for non-strict trends
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, v) => sum + v, 0);
  const sumXY = values.reduce((sum, v, i) => sum + i * v, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  if (slope > 0.05) return "upward";
  if (slope < -0.05) return "downward";
  return "stable";
};
