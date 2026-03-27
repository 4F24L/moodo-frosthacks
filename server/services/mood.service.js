import Mood from "../models/Mood.js";
import { normalize, round } from "../utils/math.js";
import {
    analyzeSentiment,
    combineSentimentWithMood,
} from "./sentiment.service.js";

/**
 * Generate insight text based on features and sentiment
 */
export const generateInsight = (features, sentimentScore) => {
  const pitch = features?.pitch || 0;
  const energy = features?.energy || 0;
  const tempo = features?.tempo || features?.speech_rate || 0;
  const jitter = features?.jitter || 0;

  if (jitter > 40)
    return "High voice instability detected, possible stress or nervousness";
  if (pitch > 250 && energy > 0.07 && jitter < 10)
    return "Confident and expressive speech detected";
  if (pitch > 250 && energy > 0.07)
    return "High energy and pitch suggest excitement or stress";
  if (tempo > 150) return "Fast speech indicates urgency or nervousness";
  if (energy > 0 && energy < 0.02)
    return "Low energy suggests fatigue or low mood";
  if (sentimentScore < -0.3) return "Negative sentiment detected in text";
  if (sentimentScore > 0.5)
    return "Positive sentiment detected, indicating a good mood";

  if (pitch === 0 && jitter === 0) {
    if (sentimentScore > 0.2)
      return "Positive and optimistic text patterns observed.";
    if (sentimentScore < -0.2)
      return "Somewhat negative text patterns observed, take care.";
    return "Text patterns appear stable and normal.";
  }

  return "Speech patterns appear stable and normal";
};

/**
 * Generate mood score from voice features
 * @param {object} features - { pitch, jitter, speech_rate }
 * @returns {object} { moodScore, label, confidence }
 */
export const generateMoodScore = (features) => {
  const { pitch, jitter, speech_rate } = features;

  // Normalize features to 0-1 range
  const pitchNorm = normalize(pitch, 50, 300); // 50-300 Hz typical range
  const jitterNorm = 1 - normalize(jitter, 0, 0.1); // Lower jitter = better
  const speechRateNorm = normalize(speech_rate, 100, 200); // 100-200 wpm typical

  // Weighted combination (mood score 0-10)
  const rawScore =
    pitchNorm * 0.3 + // Pitch stability
    jitterNorm * 0.4 + // Jitter (voice quality)
    speechRateNorm * 0.3; // Speech rate

  const moodScore = round(rawScore * 10, 1);

  // Determine label to match AI service format
  let label = "Medium";
  if (moodScore < 3.5) label = "Low";
  else if (moodScore > 6.5) label = "High";

  return {
    moodScore,
    label,
    confidence: round(0.85, 2), // Base confidence for feature-based analysis
  };
};

/**
 * Create mood entry from AI service response
 * Privacy: audio is processed and immediately discarded
 * @param {string} userId - User ID
 * @param {object} aiResult - AI service response
 * @returns {object} Created mood entry
 */
export const createMoodEntryFromAI = async (userId, aiResult) => {
  // Map AI response to mood entry
  const moodEntry = await Mood.create({
    user: userId,
    source: "voice",
    moodScore: aiResult.moodScore,
    normalizedScore: aiResult.normalizedScore,
    moodLabel: aiResult.moodLabel,
    insight: aiResult.insight,
    confidenceScore: aiResult.confidenceScore,
    features: aiResult.features,
    sentiment: aiResult.rawSentiment,
    text: aiResult.text,
    timestamp: aiResult.timestamp,
  });

  return moodEntry;
};

/**
 * Create mood entry with features
 */
export const createMoodEntry = async (userId, features, text = null) => {
  // Analyze sentiment if text provided
  let sentimentData = { sentiment: null };
  if (text) {
    const sentiment = analyzeSentiment(text);
    sentimentData = {
      sentiment: {
        compound: sentiment.sentimentScore,
        label: sentiment.label,
      },
    };
  }

  // Generate mood score from features
  let { moodScore, label } = generateMoodScore(features);

  const hasFeatures =
    features &&
    (features.pitch !== 0 ||
      features.jitter !== 0 ||
      features.speech_rate !== 0);

  if (text && sentimentData.sentiment) {
    if (hasFeatures) {
      moodScore = combineSentimentWithMood(
        moodScore,
        sentimentData.sentiment.compound,
      );
    } else {
      moodScore = 5 + sentimentData.sentiment.compound * 4; // Scale to 1-9 mostly
      moodScore = Math.max(1, Math.min(10, Math.round(moodScore * 10) / 10));
    }
  }

  if (moodScore < 3.5) label = "Low";
  else if (moodScore > 6.5) label = "High";
  else label = "Medium";

  const insightText = generateInsight(
    features || {},
    sentimentData.sentiment?.compound || 0,
  );

  // Create mood entry
  const moodEntry = await Mood.create({
    user: userId,
    source: hasFeatures ? "voice" : "text",
    moodScore,
    normalizedScore: round(moodScore / 10, 2),
    moodLabel: label,
    insight: insightText,
    confidenceScore: 0.85,
    features,
    sentiment: sentimentData.sentiment,
    text,
    timestamp: new Date().toISOString(),
  });

  return moodEntry;
};

/**
 * Get mood history for user
 */
export const getMoodHistory = async (userId, rangeInDays = 7, limit = 20) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - rangeInDays);

  const entries = await Mood.find({
    user: userId,
    createdAt: { $gte: startDate },
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return entries;
};

/**
 * Get latest mood entry
 */
export const getLatestMood = async (userId) => {
  const entry = await Mood.findOne({ user: userId }).sort({ createdAt: -1 });
  return entry;
};

/**
 * Get mood statistics for dashboard
 */
export const getMoodStats = async (userId, rangeInDays = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - rangeInDays);

  const entries = await Mood.find({
    user: userId,
    createdAt: { $gte: startDate },
  }).sort({ createdAt: -1 });

  if (entries.length === 0) {
    return {
      entries: [],
      averageMood: 0,
      minMood: 0,
      maxMood: 0,
      entryCount: 0,
    };
  }

  const scores = entries.map((e) => e.moodScore);
  const average = round(scores.reduce((a, b) => a + b, 0) / scores.length, 2);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  return {
    entries,
    averageMood: average,
    minMood: min,
    maxMood: max,
    entryCount: entries.length,
  };
};

/**
 * Calculate the user's current daily streak based on mood entries
 */
export const getUserStreak = async (userId) => {
  const entries = await Mood.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("createdAt");

  if (!entries || entries.length === 0) return 0;

  // Extract unique UTC dates (YYYY-MM-DD)
  const uniqueDates = [
    ...new Set(
      entries.map((e) => {
        const d = new Date(e.createdAt);
        return d.toISOString().split("T")[0];
      }),
    ),
  ];

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  // If the latest logged date isn't today or yesterday, the streak is 0
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(uniqueDates[0]); // Start counting from the most recent log

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = uniqueDates[i];
    const expectedStr = currentDate.toISOString().split("T")[0];

    if (d === expectedStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
    } else {
      break; // Streak broken
    }
  }

  return streak;
};
