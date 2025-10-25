"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, LogOut } from "lucide-react"

interface DashboardHeaderProps {
  user: { name: string } | null
  onLogout: () => void
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Pocket Guardian</h1>
          <p className="text-sm text-slate-400">Financial Dashboard</p>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/coaching" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition">
            <Brain size={20} />
            <span className="text-sm font-medium">AI Coach</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Welcome, {user?.name}</span>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
