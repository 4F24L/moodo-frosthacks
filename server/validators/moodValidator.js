import { z } from "zod";

/**
 * Validate voice features input
 */
export const voiceFeaturesSchema = z.object({
  features: z.object({
    pitch: z.number().min(0).max(500, "Pitch must be between 0-500 Hz"),
    jitter: z.number().min(0).max(1, "Jitter must be between 0-1"),
    speech_rate: z.number().min(0).max(300, "Speech rate must be between 0-300 wpm"),
  }),
});

/**
 * Validate text sentiment input
 */
export const textSentimentSchema = z.object({
  text: z.string().min(1, "Text is required").max(5000, "Text must be under 5000 characters"),
});

/**
 * Validate mood score input (for direct feature submission)
 */
export const moodAnalyzeSchema = z.object({
  features: z.object({
    pitch: z.number().min(0).max(500),
    jitter: z.number().min(0).max(1),
    speech_rate: z.number().min(0).max(300),
  }),
  text: z.string().optional(),
});

/**
 * Validate audio processing input
 * Privacy: audio is processed and immediately discarded
 */
export const audioProcessSchema = z.object({
  text: z.string().optional(),
});

/**
 * Validate dashboard query params
 */
export const dashboardQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).default("7d"),
});

/**
 * Validate history query params
 */
export const historyQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d"]).default("7d"),
  limit: z.coerce.number().min(1).max(100).default(20),
});
