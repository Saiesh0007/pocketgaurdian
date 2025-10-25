"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", spending: 2400, budget: 2400 },
  { month: "Feb", spending: 2210, budget: 2400 },
  { month: "Mar", spending: 2290, budget: 2400 },
  { month: "Apr", spending: 2000, budget: 2400 },
  { month: "May", spending: 2181, budget: 2400 },
  { month: "Jun", spending: 2500, budget: 2400 },
  { month: "Jul", spending: 2100, budget: 2400 },
  { month: "Aug", spending: 2851, budget: 2400 },
]

export default function SpendingChart() {
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Spending Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Line type="monotone" dataKey="spending" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
          <Line type="monotone" dataKey="budget" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-slate-300">Actual Spending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
          <span className="text-sm text-slate-300">Budget</span>
        </div>
      </div>
    </Card>
  )
}
