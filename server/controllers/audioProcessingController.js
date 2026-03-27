import { analyzeVoiceBuffer } from "../services/aiService.js";
import * as alertService from "../services/alert.service.js";
import * as moodService from "../services/mood.service.js";
import * as trendService from "../services/trend.service.js";

/**
 * POST /mood/process-audio
 * Privacy-first audio processing pipeline
 *
 * Flow:
 * 1. Validate audio file exists and is valid MIME type
 * 2. Store audio TEMPORARILY in memory (no disk persistence)
 * 3. Call AI service with audio + optional text
 * 4. Immediately discard audio buffer (privacy)
 * 5. Transform AI response and store only structured data in DB
 * 6. Run trend and alert analysis
 * 7. Return mood score, trend, and alert status
 *
 * Privacy: audio is processed and immediately discarded
 */
export const processAudio = async (req, res, next) => {
  try {
    // Validate audio file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "Audio file too large. Maximum size is 10MB",
      });
    }

    // Validate file type
    const allowedMimeTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audio format. Supported formats: WAV, MP3, WebM, OGG",
      });
    }

    // Validate buffer exists
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Audio file is empty or corrupted",
      });
    }

    const { text } = req.body;
    const audioBuffer = req.file.buffer;
    const filename = req.file.originalname;

    // Call AI service with audio buffer
    let aiResult;
    try {
      aiResult = await analyzeVoiceBuffer(audioBuffer, filename, text);
    } catch (aiError) {
      console.error('AI service error:', aiError);
      return res.status(503).json({
        success: false,
        message: "Audio analysis service temporarily unavailable. Please try again.",
      });
    }

    // Discard audio buffer reference (privacy)
    req.file.buffer = null;

    // Validate AI result
    if (!aiResult || typeof aiResult !== 'object') {
      return res.status(500).json({
        success: false,
        message: "Failed to analyze audio. Please try again.",
      });
    }

    // Transform AI response to mood entry
    let moodEntry;
    try {
      moodEntry = await moodService.createMoodEntryFromAI(
        req.user._id,
        aiResult,
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to save mood entry. Please try again.",
      });
    }

    // Get recent entries for trend and alert analysis
    const entries = await moodService.getMoodHistory(req.user._id, 7, 10);

    // Analyze trend (with fallback)
    let trend = { trend: 0, fluctuation: 0 };
    try {
      trend = trendService.getTrendSummary(entries);
    } catch (trendError) {
      console.error('Trend analysis error:', trendError);
    }

    // Check for alerts (with fallback)
    let alert = null;
    try {
      alert = await alertService.createAlertIfNeeded(req.user._id, entries);
    } catch (alertError) {
      console.error('Alert creation error:', alertError);
    }

    res.status(201).json({
      success: true,
      data: {
        text: moodEntry.text || "Audio processed successfully",
        source: "voice",
        mood_score: moodEntry.moodScore ?? 5.0,
        normalized_score: moodEntry.normalizedScore ?? 0,
        mood_label: moodEntry.moodLabel || "Neutral",
        insight: moodEntry.insight || "Analysis complete",
        confidence: moodEntry.confidenceScore ?? 0.5,
        features: moodEntry.features || {},
        sentiment: moodEntry.sentiment || {},
        timestamp: moodEntry.timestamp || new Date(),
        trend: trend.trend ?? 0,
        fluctuation: trend.fluctuation ?? 0,
        alert: alert
          ? {
              id: alert._id,
              type: alert.type,
              message: alert.message,
              severity: alert.severity,
            }
          : null,
      },
    });
  } catch (err) {
    console.error('Unexpected error in processAudio:', err);
    next(err);
  }
};
