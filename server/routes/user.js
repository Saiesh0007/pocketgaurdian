import express from "express"
import User from "../models/User.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message })
  }
})

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { monthlyIncome, incomeVariability, savingsGoal, riskTolerance } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        monthlyIncome,
        incomeVariability,
        savingsGoal,
        riskTolerance,
      },
      { new: true },
    ).select("-password")

    res.json({ message: "Profile updated", user })
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message })
  }
})

// Get financial summary
router.get("/summary", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    res.json({
      financialProfile: user.financialProfile,
      spendingPatterns: user.spendingPatterns,
      monthlyIncome: user.monthlyIncome,
      incomeVariability: user.incomeVariability,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary", error: error.message })
  }
})

export default router
