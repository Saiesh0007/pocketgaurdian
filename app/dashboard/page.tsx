"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import FinancialMetrics from "@/components/dashboard/financial-metrics"
import SpendingChart from "@/components/dashboard/spending-chart"
import IncomeOverview from "@/components/dashboard/income-overview"
import SavingsGoals from "@/components/dashboard/savings-goals"
import FinancialHealth from "@/components/dashboard/financial-health"
import { Brain, TrendingUp, Wallet, Target } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/coaching"
            className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 rounded-lg p-4 hover:border-emerald-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Brain className="text-emerald-400" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">AI Coach</p>
                <p className="text-xs text-slate-400">Get advice</p>
              </div>
            </div>
          </Link>

          <Link
            href="/transactions"
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Wallet className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-300">Transactions</p>
                <p className="text-xs text-slate-400">Track spending</p>
              </div>
            </div>
          </Link>

          <Link
            href="/income"
            className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/50 rounded-lg p-4 hover:border-purple-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-300">Income</p>
                <p className="text-xs text-slate-400">Manage sources</p>
              </div>
            </div>
          </Link>

          <Link
            href="/recommendations"
            className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 border border-amber-500/50 rounded-lg p-4 hover:border-amber-400 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Target className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-300">Recommendations</p>
                <p className="text-xs text-slate-400">View all tips</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <Brain className="text-emerald-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Get AI Financial Coaching</h2>
                <p className="text-slate-300 text-sm">
                  Get personalized financial advice from Pocket Guardian AI. Analyze your spending patterns, income
                  variability, and get actionable recommendations.
                </p>
              </div>
            </div>
            <Link
              href="/coaching"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition whitespace-nowrap"
            >
              Start Coaching
            </Link>
          </div>
        </div>

        {/* Financial Metrics Overview */}
        <FinancialMetrics />

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div>
            <IncomeOverview />
          </div>
        </div>

        {/* Savings and Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SavingsGoals />
          <FinancialHealth />
        </div>
      </div>
    </main>
  )
}
