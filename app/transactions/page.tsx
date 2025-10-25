"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface Transaction {
  _id: string
  type: "income" | "expense" | "savings" | "investment"
  category: string
  amount: number
  description: string
  date: string
  recurring: boolean
  frequency: string
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Gig Work", "Investment Returns", "Other"],
  expense: ["Food", "Utilities", "Rent", "Transport", "Entertainment", "Healthcare", "Other"],
  savings: ["Emergency Fund", "Goal Savings", "Retirement", "Other"],
  investment: ["Stocks", "Crypto", "Real Estate", "Bonds", "Other"],
}

export default function TransactionsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "savings" | "investment">("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense" as const,
    category: "Food",
    amount: "",
    description: "",
    recurring: false,
    frequency: "none",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/transactions/list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      if (!response.ok) throw new Error("Failed to add transaction")
      setFormData({
        type: "expense",
        category: "Food",
        amount: "",
        description: "",
        recurring: false,
        frequency: "none",
      })
      setShowAddForm(false)
      await fetchTransactions()
    } catch (err) {
      console.error("Error adding transaction:", err)
      setError("Failed to add transaction")
    }
  }

  const filteredTransactions = transactions.filter((t) => filterType === "all" || t.type === filterType)

  const stats = {
    income: transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    expenses: transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    savings: transactions.filter((t) => t.type === "savings").reduce((sum, t) => sum + t.amount, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Transaction Manager</h1>
            <p className="text-slate-400 mt-2">Track your income, expenses, and savings</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Income</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">${stats.income.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-emerald-400" size={32} />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Expenses</p>
                <p className="text-3xl font-bold text-red-400 mt-2">${stats.expenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="text-red-400" size={32} />
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Savings</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">${stats.savings.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-blue-400" size={32} />
            </div>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                        category: CATEGORIES[e.target.value as keyof typeof CATEGORIES][0],
                      })
                    }}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES[formData.type].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.recurring}
                      onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    Recurring
                  </label>
                </div>
                {formData.recurring && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(["all", "income", "expense", "savings", "investment"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                filterType === type ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300">{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400">No transactions yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Description</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-emerald-900/50 text-emerald-300"
                              : transaction.type === "expense"
                                ? "bg-red-900/50 text-red-300"
                                : transaction.type === "savings"
                                  ? "bg-blue-900/50 text-blue-300"
                                  : "bg-purple-900/50 text-purple-300"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{transaction.description || "-"}</td>
                      <td className="px-6 py-4 text-sm text-right font-semibold">
                        <span
                          className={
                            transaction.type === "income"
                              ? "text-emerald-400"
                              : transaction.type === "expense"
                                ? "text-red-400"
                                : "text-slate-300"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
