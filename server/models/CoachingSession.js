import mongoose from "mongoose"

const coachingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: String,
    userMessage: String,
    coachAdvice: String,
    recommendations: [String],
    actionItems: [String],
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "concerning"],
      default: "neutral",
    },
    followUpDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("CoachingSession", coachingSessionSchema)
