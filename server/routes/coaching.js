import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Groq } from "groq-sdk";
import CoachingSession from "../models/CoachingSession.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Get AI coaching advice
router.post("/get-advice", verifyToken, async (req, res) => {
  try {
    const { userMessage, topic } = req.body;

    const user = await User.findById(req.userId);
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(20);

    const userContext = `
User Profile:
- Income Type: ${user.incomeType}
- Monthly Income: $${user.monthlyIncome}
- Income Variability: ${user.incomeVariability}%
- Risk Tolerance: ${user.riskTolerance}
- Savings Goal: $${user.savingsGoal}
- Total Savings: $${user.financialProfile.totalSavings}
- Total Debt: $${user.financialProfile.totalDebt}

Recent Spending Patterns:
- Essentials: $${user.spendingPatterns.essentials}
- Discretionary: $${user.spendingPatterns.discretionary}
- Savings: $${user.spendingPatterns.savings}
- Investments: $${user.spendingPatterns.investments}

Recent Transactions:
${transactions
  .map((t) => `- ${t.type}: $${t.amount} (${t.category})`)
  .join("\n")}
    `;

    const systemPrompt = `You are Pocket Guardian, an autonomous financial coaching agent ...`;

    // ✅ FIXED: use the correct Groq API call
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `${userContext}\n\nUser Question: ${userMessage}`,
        },
      ],
      max_tokens: 1024,
    });

    const coachAdvice = completion.choices[0].message.content;

    const session = new CoachingSession({
      userId: req.userId,
      topic: topic || "General Financial Advice",
      userMessage,
      coachAdvice,
      recommendations: extractRecommendations(coachAdvice),
      actionItems: extractActionItems(coachAdvice),
    });

    await session.save();

    res.json({
      advice: coachAdvice,
      recommendations: session.recommendations,
      actionItems: session.actionItems,
      sessionId: session._id,
    });
  } catch (error) {
    console.error("❌ Error in get-advice:", error);
    res
      .status(500)
      .json({ message: "Error getting coaching advice", error: error.message });
  }
});

// Get coaching history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const sessions = await CoachingSession.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching history", error: error.message });
  }
});

// Helper functions
function extractRecommendations(text) {
  const recommendations = [];
  const lines = text.split("\n");
  lines.forEach((line) => {
    if (
      line.includes("recommend") ||
      line.includes("suggest") ||
      line.includes("consider")
    ) {
      recommendations.push(line.trim());
    }
  });
  return recommendations.slice(0, 5);
}

function extractActionItems(text) {
  const actionItems = [];
  const lines = text.split("\n");
  lines.forEach((line) => {
    if (
      line.includes("action") ||
      line.includes("step") ||
      line.includes("do") ||
      line.includes("start")
    ) {
      actionItems.push(line.trim());
    }
  });
  return actionItems.slice(0, 5);
}

export default router;
