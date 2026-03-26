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

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;
