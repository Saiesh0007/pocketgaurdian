"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Lightbulb, CheckCircle, MessageCircle, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface CoachingSession {
  _id: string
  topic: string
  userMessage: string
  coachAdvice: string
  recommendations: string[]
  actionItems: string[]
  createdAt: string
}

interface CoachingResponse {
  advice: string
  recommendations: string[]
  actionItems: string[]
  sessionId: string
}

const TOPICS = [
  "General Financial Advice",
  "Budgeting & Spending",
  "Savings Strategy",
  "Income Variability",
  "Emergency Fund",
  "Debt Management",
]

export default function CoachingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [message, setMessage] = useState("")
  const [topic, setTopic] = useState("General Financial Advice")
  const [sessions, setSessions] = useState<CoachingSession[]>([])
  const [currentAdvice, setCurrentAdvice] = useState<CoachingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentAdvice])

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to access coaching")
        return
      }

      const response = await fetch("/api/coaching/history", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch history")
      const data = await response.json()
      setSessions(data)
    } catch (err) {
      console.error("Error fetching history:", err)
      setError("Failed to load coaching history")
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to get coaching advice")
        return
      }

      const response = await fetch("/api/coaching/get-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userMessage: message, topic }),
      })

      if (!response.ok) throw new Error("Failed to get coaching advice")
      const data: CoachingResponse = await response.json()
      setCurrentAdvice(data)
      setMessage("")
      await fetchHistory()
    } catch (err) {
      console.error("Error getting advice:", err)
      setError("Failed to get coaching advice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Financial Coaching</h1>
          <p className="text-slate-400">Get personalized financial advice from Pocket Guardian AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <MessageCircle className="text-emerald-400" size={28} />
                Ask Your Coach
              </h2>

              {/* Advice Display */}
              {currentAdvice && (
                <div className="mb-6 p-5 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
                  <h3 className="font-bold text-emerald-300 mb-3 flex items-center gap-2">
                    <Lightbulb size={20} />
                    Coach's Advice
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed mb-4">{currentAdvice.advice}</p>

                  {currentAdvice.recommendations.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-700/50 rounded">
                      <p className="font-semibold text-emerald-300 text-sm mb-2">💡 Recommendations:</p>
                      <ul className="space-y-2">
                        {currentAdvice.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentAdvice.actionItems.length > 0 && (
                    <div className="p-3 bg-slate-700/50 rounded">
                      <p className="font-semibold text-emerald-300 text-sm mb-2">✓ Action Items:</p>
                      <ul className="space-y-2">
                        {currentAdvice.actionItems.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mt-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Coaching Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask your financial coach..."
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 transition"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="text-amber-400" size={24} />
              Recent Sessions
            </h2>

            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader size={24} className="animate-spin text-emerald-400" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-slate-400 text-sm">No coaching sessions yet. Start by asking a question!</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.slice(0, 10).map((session) => (
                  <div
                    key={session._id}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-emerald-500/50 transition cursor-pointer"
                    onClick={() => {
                      setCurrentAdvice({
                        advice: session.coachAdvice,
                        recommendations: session.recommendations,
                        actionItems: session.actionItems,
                        sessionId: session._id,
                      })
                    }}
                  >
                    <p className="font-semibold text-sm text-emerald-300">{session.topic}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{session.userMessage}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(session.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
