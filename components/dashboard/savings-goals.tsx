import { Card } from "@/components/ui/card"
import { Target } from "lucide-react"

const goals = [
  { name: "Emergency Fund", current: 5000, target: 10000, percentage: 50 },
  { name: "Vacation", current: 2500, target: 5000, percentage: 50 },
  { name: "New Car", current: 8000, target: 25000, percentage: 32 },
]

export default function SavingsGoals() {
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">Savings Goals</h2>
      </div>
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-slate-300 font-medium">{goal.name}</span>
              <span className="text-emerald-400 font-medium">{goal.percentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${goal.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>${goal.current.toLocaleString()}</span>
              <span>${goal.target.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
