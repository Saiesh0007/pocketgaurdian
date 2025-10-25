"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { User, Mail, Lock, Briefcase } from "lucide-react"

export default function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    incomeType: "gig",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/auth/register", formData)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setIsAuthenticated(true)
      navigate("/profile")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
              Pocket Guardian
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Start your financial journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-12"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-12"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-12"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Income Type
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={18} />
                <select
                  name="incomeType"
                  value={formData.incomeType}
                  onChange={handleChange}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-12"
                >
                  <option value="gig">Gig Worker</option>
                  <option value="informal">Informal Sector</option>
                  <option value="salaried">Salaried</option>
                  <option value="mixed">Mixed Income</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary w-full h-10 sm:h-12 text-sm sm:text-base font-medium mt-4 sm:mt-6"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}