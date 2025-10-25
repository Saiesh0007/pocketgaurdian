"use client"

import { useState, useEffect } from "react"
import { Lightbulb, CheckCircle, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface Recommendation {
  sessionId: string
  topic: string
  recommendations: string[]
  actionItems: string[]
  createdAt: string
}

export default function RecommendationsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/coaching/history", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch recommendations")
      const data = await response.json()

      const recs = data
        .filter((session: any) => session.recommendations.length > 0 || session.actionItems.length > 0)
        .map((session: any) => ({
          sessionId: session._id,
          topic: session.topic,
          recommendations: session.recommendations,
          actionItems: session.actionItems,
          createdAt: session.createdAt,
        }))

      setRecommendations(recs)
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError("Failed to load recommendations")
    } finally {
      setLoading(false)
    }
  }

  const toggleCompleted = (itemId: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const allActionItems = recommendations.flatMap((rec) =>
    rec.actionItems.map((item, idx) => ({
      id: `${rec.sessionId}-action-${idx}`,
      item,
      topic: rec.topic,
      date: rec.createdAt,
    })),
  )

  const allRecommendations = recommendations.flatMap((rec) =>
    rec.recommendations.map((rec_item, idx) => ({
      id: `${rec.sessionId}-rec-${idx}`,
      item: rec_item,
      topic: rec.topic,
      date: rec.createdAt,
    })),
  )

  const completionRate = allActionItems.length > 0 ? (completedItems.size / allActionItems.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Coaching Recommendations</h1>
          <p className="text-slate-400">Track all recommendations and action items from your coaching sessions</p>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-500/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm font-medium">Action Items Completion</p>
              <p className="text-4xl font-bold text-emerald-400 mt-2">{Math.round(completionRate)}%</p>
              <p className="text-slate-400 text-sm mt-1">
                {completedItems.size} of {allActionItems.length} items completed
              </p>
            </div>
            <div className="w-24 h-24 rounded-full bg-slate-700/50 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="text-emerald-400 mx-auto mb-2" size={32} />
                <p className="text-emerald-400 font-bold text-lg">{Math.round(completionRate)}%</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading recommendations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300">{error}</div>
        ) : recommendations.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <Lightbulb className="mx-auto mb-4 text-slate-500" size={48} />
            <p className="text-slate-400">No recommendations yet. Get coaching advice to see recommendations here!</p>
            <Link href="/coaching" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block">
              Start Coaching →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Action Items Section */}
            {allActionItems.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="text-blue-400" size={28} />
                  Action Items
                </h2>
                <div className="space-y-3">
                  {allActionItems.map((action) => (
                    <div
                      key={action.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleCompleted(action.id)}
                          className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                            completedItems.has(action.id)
                              ? "bg-blue-600 border-blue-600"
                              : "border-slate-600 hover:border-blue-400"
                          }`}
                        >
                          {completedItems.has(action.id) && <CheckCircle size={20} className="text-white" />}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              completedItems.has(action.id) ? "text-slate-500 line-through" : "text-slate-200"
                            }`}
                          >
                            {action.item}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400">
                              {action.topic}
                            </span>
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-500">
                              {new Date(action.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {allRecommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="text-amber-400" size={28} />
                  Recommendations
                </h2>
                <div className="space-y-3">
                  {allRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-amber-500/50 transition"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-slate-200">{rec.item}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400">{rec.topic}</span>
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-500">
                              {new Date(rec.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
