"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Send, Lightbulb, CheckCircle, MessageCircle } from "lucide-react"

export default function Coaching() {
  const [message, setMessage] = useState("")
  const [topic, setTopic] = useState("General Financial Advice")
  const [sessions, setSessions] = useState([])
  const [currentAdvice, setCurrentAdvice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const token = typeof window !== 'undefined' ? window.localStorage?.getItem("token") : null

  useEffect(() => {
    fetchHistory()
  }, [token])

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/api/coaching/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSessions(response.data)
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    try {
      const response = await axios.post(
        "/api/coaching/get-advice",
        { userMessage: message, topic },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setCurrentAdvice(response.data)
      setMessage("")
      fetchHistory()
    } catch (error) {
      console.error("Error getting advice:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
          Financial Coaching
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 order-1">
            <div className="card">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <MessageCircle className="text-green-600" size={20} />
                <span>Ask Your Coach</span>
              </h2>

              {!currentAdvice && (
                <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <MessageCircle className="mx-auto text-blue-500 mb-3" size={48} />
                  <h3 className="font-bold text-blue-900 mb-2 text-sm sm:text-base">Welcome to Financial Coaching!</h3>
                  <p className="text-blue-800 text-xs sm:text-sm">
                    Ask me anything about budgeting, savings, debt management, or general financial advice. 
                    I'm here to help you make better financial decisions.
                  </p>
                </div>
              )}

              {currentAdvice && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg overflow-y-auto max-h-64 sm:max-h-80">
                  <h3 className="font-bold text-green-900 mb-2 text-sm sm:text-base">Coach's Advice:</h3>
                  <p className="text-green-800 text-xs sm:text-sm mb-3 sm:mb-4">{currentAdvice.advice}</p>

                  {currentAdvice.recommendations.length > 0 && (
                    <div className="mb-3">
                      <p className="font-semibold text-green-900 text-xs sm:text-sm mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {currentAdvice.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-green-800 flex items-start gap-2">
                            <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentAdvice.actionItems.length > 0 && (
                    <div>
                      <p className="font-semibold text-green-900 text-xs sm:text-sm mb-2">Action Items:</p>
                      <ul className="space-y-1">
                        {currentAdvice.actionItems.map((item, idx) => (
                          <li key={idx} className="text-xs text-green-800 flex items-start gap-2">
                            <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Topic</label>
                  <select 
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)} 
                    className="input-field text-sm w-full h-10 sm:h-11"
                  >
                    <option>General Financial Advice</option>
                    <option>Budgeting & Spending</option>
                    <option>Savings Strategy</option>
                    <option>Income Variability</option>
                    <option>Emergency Fund</option>
                    <option>Debt Management</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask your financial coach..."
                    className="input-field flex-1 text-sm h-10 sm:h-11"
                  />
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary px-3 sm:px-4 flex-shrink-0 h-10 sm:h-11"
                  >
                    {loading ? (
                      <span className="text-xs sm:text-sm">...</span>
                    ) : (
                      <Send size={18} className="sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="card order-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Lightbulb className="text-amber-600" size={20} />
              <span>Recent Sessions</span>
            </h2>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="text-gray-600 text-sm mt-2">Loading...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Lightbulb className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 text-xs sm:text-sm">
                  No coaching sessions yet. Start by asking a question!
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-[500px] overflow-y-auto">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session._id} className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900">{session.topic}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{session.userMessage}</p>
                    <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
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