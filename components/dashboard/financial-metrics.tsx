import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, Wallet } from "lucide-react"

export default function FinancialMetrics() {
  const metrics = [
    {
      label: "Total Balance",
      value: "$12,450.50",
      change: "+5.2%",
      positive: true,
      icon: Wallet,
    },
    {
      label: "Monthly Income",
      value: "$4,200.00",
      change: "+2.1%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Monthly Spending",
      value: "$2,850.75",
      change: "-8.3%",
      positive: true,
      icon: TrendingDown,
    },
    {
      label: "Savings Goal",
      value: "$1,349.25",
      change: "79% of target",
      positive: true,
      icon: Target,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm mt-2 ${metric.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {metric.change}
                </p>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
