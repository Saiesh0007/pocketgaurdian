import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    incomeType: {
      type: String,
      enum: ["gig", "informal", "salaried", "mixed"],
      default: "gig",
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    incomeVariability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    savingsGoal: {
      type: Number,
      default: 0,
    },
    riskTolerance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    financialProfile: {
      totalSavings: { type: Number, default: 0 },
      totalDebt: { type: Number, default: 0 },
      creditScore: { type: Number, default: 0 },
      emergencyFund: { type: Number, default: 0 },
    },
    spendingPatterns: {
      essentials: { type: Number, default: 0 },
      discretionary: { type: Number, default: 0 },
      savings: { type: Number, default: 0 },
      investments: { type: Number, default: 0 },
    },
    coachingHistory: [
      {
        date: Date,
        topic: String,
        advice: String,
        outcome: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema)
