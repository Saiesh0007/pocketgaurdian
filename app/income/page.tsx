"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface IncomeSource {
  _id: string
  type: string
  category: string
  amount: number
  description: string
  date: string
  recurring: boolean
  frequency: string
}

export default function IncomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [incomes, setIncomes] = useState<IncomeSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    category: "Salary",
    amount: "",
    description: "",
    recurring: true,
    frequency: "monthly",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch income")
      const data = await response.json()
      setIncomes(data.filter((t: any) => t.type === "income"))
    } catch (err) {
      console.error("Error fetching income:", err)
      setError("Failed to load income sources")
    } finally {
      setLoading(false)
    }
  }

  const handleAddIncome = async (e: React.FormEvent) => {
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
          type: "income",
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      if (!response.ok) throw new Error("Failed to add income")
      setFormData({
        category: "Salary",
        amount: "",
        description: "",
        recurring: true,
        frequency: "monthly",
      })
      setShowAddForm(false)
      await fetchIncomes()
    } catch (err) {
      console.error("Error adding income:", err)
      setError("Failed to add income source")
    }
  }

  const totalMonthlyIncome = incomes
    .filter((i) => i.recurring && i.frequency === "monthly")
    .reduce((sum, i) => sum + i.amount, 0)

  const totalAnnualIncome = incomes.reduce((sum, i) => {
    if (i.frequency === "monthly") return sum + i.amount * 12
    if (i.frequency === "weekly") return sum + i.amount * 52
    if (i.frequency === "yearly") return sum + i.amount
    return sum
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Income Management</h1>
            <p className="text-slate-400 mt-2">Track your income sources and variability</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add Income Source
          </button>
        </div>

        {/* Income Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Monthly Income</p>
                <p className="text-4xl font-bold text-emerald-400 mt-2">${totalMonthlyIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-emerald-400" size={40} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Annual Income</p>
                <p className="text-4xl font-bold text-blue-400 mt-2">${totalAnnualIncome.toFixed(2)}</p>
              </div>
              <Calendar className="text-blue-400" size={40} />
            </div>
          </div>
        </div>

        {/* Add Income Form */}
        {showAddForm && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add Income Source</h2>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option>Salary</option>
                    <option>Freelance</option>
                    <option>Gig Work</option>
                    <option>Investment Returns</option>
                    <option>Other</option>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Monthly salary from Company X"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  Add Income Source
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

        {/* Income Sources List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading income sources...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300">{error}</div>
        ) : incomes.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400">No income sources yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incomes.map((income) => (
              <div
                key={income._id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{income.category}</h3>
                    <p className="text-slate-400 text-sm mt-1">{income.description}</p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">${income.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{income.recurring ? `${income.frequency}` : "One-time"}</span>
                  <span className="text-slate-500">{new Date(income.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
