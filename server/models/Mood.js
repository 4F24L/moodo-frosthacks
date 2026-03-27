import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster user queries
    },
    moodScore: {
      type: Number,
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
    confidenceScore: {
      type: Number,
      default: null,
    },
    features: {
      type: Object,
      default: null,
    },
    sentiment: {
      type: Object,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    source: {
      type: String,
      enum: ["voice", "text"],
      required: true,
    },
    timestamp: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for efficient date-based queries
moodSchema.index({ createdAt: -1 });
moodSchema.index({ user: 1, createdAt: -1 });

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;
