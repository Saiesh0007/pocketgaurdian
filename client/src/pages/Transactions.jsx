"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense",
    category: "food",
    amount: 0,
    description: "",
    recurring: false,
  })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchTransactions()
  }, [token])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransactions(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "amount" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/transactions/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({
        type: "expense",
        category: "food",
        amount: 0,
        description: "",
        recurring: false,
      })
      setShowForm(false)
      fetchTransactions()
    } catch (error) {
      console.error("Error adding transaction:", error)
    }
  }

  if (loading) return <div className="p-8">Loading transactions...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Add Transaction
          </button>
        </div>

        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., food, utilities"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600"
                />
                <label className="ml-2 text-sm text-gray-700">Recurring transaction</label>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">
                  Add Transaction
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No transactions yet. Add one to get started!</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction._id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {transaction.type === "income" || transaction.type === "savings" ? (
                    <TrendingUp className="text-green-600" size={24} />
                  ) : (
                    <TrendingDown className="text-red-600" size={24} />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-600">{transaction.description || "No description"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${transaction.type === "income" || transaction.type === "savings" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "income" || transaction.type === "savings" ? "+" : "-"}${transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
