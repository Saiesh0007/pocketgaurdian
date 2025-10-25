"use client"

import { Link, useNavigate } from "react-router-dom"
import { LogOut, Home, User, MessageSquare, CreditCard } from "lucide-react"

export default function Navigation() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <img 
            src="/favicon.ico" 
            alt="Pocket Guardian Logo" 
            className="w-8 h-8"
          />
          Pocket Guardian
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-500 transition">
            <Home size={20} />
            Dashboard
          </Link>
          <Link to="/transactions" className="flex items-center gap-2 hover:text-green-500 transition">
            <CreditCard size={20} />
            Transactions
          </Link>
          <Link to="/coaching" className="flex items-center gap-2 hover:text-green-500 transition">
            <MessageSquare size={20} />
            Coaching
          </Link>
          <Link to="/profile" className="flex items-center gap-2 hover:text-green-500 transition">
            <User size={20} />
            Profile
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-500 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}