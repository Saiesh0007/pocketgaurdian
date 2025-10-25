"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { TrendingUp, Wallet, Target, AlertCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          axios.get("/api/user/profile", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/transactions/analytics", { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setUser(userRes.data)
        setAnalytics(analyticsRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (loading) return <div className="p-8">Loading dashboard...</div>

  const spendingData = [
    { name: "Essentials", value: user?.spendingPatterns?.essentials || 0 },
    { name: "Discretionary", value: user?.spendingPatterns?.discretionary || 0 },
    { name: "Savings", value: user?.spendingPatterns?.savings || 0 },
    { name: "Investments", value: user?.spendingPatterns?.investments || 0 },
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Monthly Income</p>
                <p className="text-3xl font-bold text-green-600">${user?.monthlyIncome || 0}</p>
              </div>
              <Wallet className="text-green-600" size={40} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Savings</p>
                <p className="text-3xl font-bold text-blue-600">${user?.financialProfile?.totalSavings || 0}</p>
              </div>
              <TrendingUp className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Savings Goal</p>
                <p className="text-3xl font-bold text-amber-600">${user?.savingsGoal || 0}</p>
              </div>
              <Target className="text-amber-600" size={40} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Income Variability</p>
                <p className="text-3xl font-bold text-red-600">{user?.incomeVariability || 0}%</p>
              </div>
              <AlertCircle className="text-red-600" size={40} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Spending Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Income</span>
                <span className="font-bold text-green-600">${analytics?.totalIncome || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-bold text-red-600">${analytics?.totalExpenses || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Savings</span>
                <span className="font-bold text-blue-600">${analytics?.totalSavings || 0}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-gray-600 font-semibold">Net Balance</span>
                <span className="font-bold text-2xl text-green-600">
                  ${(analytics?.totalIncome || 0) - (analytics?.totalExpenses || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
