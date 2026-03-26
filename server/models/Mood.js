import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moodScore: {
      type: Number,
      required: true,
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      required: true,
    },
    source: {
      type: String,
      enum: ["voice", "text"], // "text" reserved for future use
      required: true,
    },
    normalizedScore: {
      type: Number,
      default: null,
    },
    moodLabel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: null,
    },
    insight: {
      type: String,
      default: null,
    },
    features: {
      type: Object,
      default: null,
    },
    confidenceScore: {
      type: Number,
      default: null,
    },
    rawSentiment: {
      type: Object,
      default: null,
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: null,
    },
  },
  { timestamps: true }
);

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;
