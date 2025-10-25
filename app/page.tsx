"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Shield, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        setShouldRender(true)
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (!shouldRender) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-emerald-400" size={32} />
            <h1 className="text-2xl font-bold text-white">Pocket Guardian</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Create Account</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Your AI Financial Coach</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Get personalized financial guidance tailored to your unique situation. Track spending, manage income
            variability, and make smarter financial decisions with Pocket Guardian AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition">
            <Brain className="text-emerald-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">AI Coaching</h3>
            <p className="text-slate-400 text-sm">Get personalized financial advice powered by advanced AI</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
            <TrendingUp className="text-blue-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">Smart Analytics</h3>
            <p className="text-slate-400 text-sm">Track spending patterns and income variability in real-time</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition">
            <Shield className="text-purple-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-slate-400 text-sm">Your financial data is encrypted and never shared</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-amber-500/50 transition">
            <Zap className="text-amber-400 mb-4" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">Actionable Tips</h3>
            <p className="text-slate-400 text-sm">Get specific recommendations you can implement today</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Finances?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of gig workers and everyday citizens who are making smarter financial decisions with Pocket
            Guardian.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Start Your Free Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-20 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>Pocket Guardian - Your AI-Powered Financial Coach</p>
          <p className="mt-2">Secure • AI-Powered • Privacy First</p>
        </div>
      </footer>
    </main>
  )
}
