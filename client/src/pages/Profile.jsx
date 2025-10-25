"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, DollarSign, Target } from "lucide-react"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    monthlyIncome: 0,
    incomeVariability: 0,
    savingsGoal: 0,
    riskTolerance: "medium",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setFormData({
          monthlyIncome: response.data.monthlyIncome,
          incomeVariability: response.data.incomeVariability,
          savingsGoal: response.data.savingsGoal,
          riskTolerance: response.data.riskTolerance,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "monthlyIncome" || name === "incomeVariability" || name === "savingsGoal"
          ? Number.parseFloat(value)
          : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      await axios.put("/api/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage("Profile updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8">Loading profile...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Financial Profile</h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${message.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <User className="text-green-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" value={user?.name} disabled className="input-field bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={user?.email} disabled className="input-field bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
                <input type="text" value={user?.incomeType} disabled className="input-field bg-gray-100 capitalize" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <DollarSign className="text-green-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Income Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income ($)</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Variability (%)</label>
                <input
                  type="number"
                  name="incomeVariability"
                  value={formData.incomeVariability}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">How much your income varies month to month (0-100%)</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <Target className="text-green-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Savings Goal ($)</label>
                <input
                  type="number"
                  name="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Low - Conservative approach</option>
                  <option value="medium">Medium - Balanced approach</option>
                  <option value="high">High - Aggressive approach</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}
