import express from "express"
import Transaction from "../models/Transaction.js"
import User from "../models/User.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Add transaction
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { type, category, amount, description, recurring, frequency } = req.body

    const transaction = new Transaction({
      userId: req.userId,
      type,
      category,
      amount,
      description,
      recurring,
      frequency,
    })

    await transaction.save()

    // Update user spending patterns
    const user = await User.findById(req.userId)
    if (type === "expense") {
      if (category === "food" || category === "utilities" || category === "rent") {
        user.spendingPatterns.essentials += amount
      } else {
        user.spendingPatterns.discretionary += amount
      }
    } else if (type === "savings") {
      user.spendingPatterns.savings += amount
    } else if (type === "investment") {
      user.spendingPatterns.investments += amount
    }
    await user.save()

    res.status(201).json({ message: "Transaction added", transaction })
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: error.message })
  }
})

// Get transactions
router.get("/list", verifyToken, async (req, res) => {
  try {
    const { month, year } = req.query

    const query = { userId: req.userId }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 })
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error: error.message })
  }
})

// Get spending analytics
router.get("/analytics", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })

    const analytics = {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      byCategory: {},
    }

    transactions.forEach((t) => {
      if (t.type === "income") analytics.totalIncome += t.amount
      if (t.type === "expense") {
        analytics.totalExpenses += t.amount
        analytics.byCategory[t.category] = (analytics.byCategory[t.category] || 0) + t.amount
      }
      if (t.type === "savings") analytics.totalSavings += t.amount
    })

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message })
  }
})

export default router
