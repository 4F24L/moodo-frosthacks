import Mood from "../models/Mood.js";
import { normalize, round } from "../utils/math.js";
import { analyzeSentiment, combineSentimentWithMood } from "./sentiment.service.js";

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
  // Generate mood score from features
  const { moodScore, label } = generateMoodScore(features);

  // Analyze sentiment if text provided
  let sentimentData = { sentiment: null };
  if (text) {
    const sentiment = analyzeSentiment(text);
    sentimentData = {
      sentiment: sentiment.rawSentiment,
    };
  }

  // Create mood entry
  const moodEntry = await Mood.create({
    user: userId,
    source: "voice",
    moodScore,
    normalizedScore: round(moodScore / 10, 2),
    moodLabel: label,
    insight: null,
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
