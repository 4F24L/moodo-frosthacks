import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

/**
 * Maps the Python /analyze response to a normalized shape
 * @param {object} data - Raw response from AI service
 * @returns {object} Normalized mood analysis result
 */
const mapAIResponse = (data) => {
  const compound = data.sentiment?.compound ?? 0;
  const sentimentLabel =
    compound >= 0.05 ? "positive" : compound <= -0.05 ? "negative" : "neutral";

  return {
    moodScore: data.mood_score,
    normalizedScore: data.normalized_score,
    moodLabel: data.mood_label,
    insight: data.insight,
    confidenceScore: data.confidence,
    features: data.features,         // { pitch, energy, tempo, jitter }
    sentiment: sentimentLabel,        // "positive" | "neutral" | "negative"
    rawSentiment: data.sentiment,     // full VADER object { compound, pos, neg, neu }
    timestamp: data.timestamp,
  };
};

/**
 * Sends audio file to Python /analyze and returns mapped result
 * Privacy: audio is processed and immediately discarded
 * @param {string} filePath - Path to audio file
 * @param {string} text - Optional text to include in analysis
 * @returns {object} Normalized mood analysis result
 */
export const analyzeVoice = async (filePath, text = "") => {
  const form = new FormData();
  form.append("audio", fs.createReadStream(filePath));
  if (text) form.append("text", text);

  const { data } = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
    headers: form.getHeaders(),
  });

  return mapAIResponse(data);
};

/**
 * Sends audio buffer to Python /analyze and returns mapped result
 * Privacy: audio is processed and immediately discarded
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} filename - Original filename for MIME type detection
 * @param {string} text - Optional text to include in analysis
 * @returns {object} Normalized mood analysis result
 */
export const analyzeVoiceBuffer = async (audioBuffer, filename, text = "") => {
  const form = new FormData();
  form.append("audio", audioBuffer, filename);
  if (text) form.append("text", text);

  const { data } = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
    headers: form.getHeaders(),
  });

  return mapAIResponse(data);
};
