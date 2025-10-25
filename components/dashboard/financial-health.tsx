import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function FinancialHealth() {
  const healthMetrics = [
    { label: "Debt-to-Income Ratio", value: "25%", status: "good" },
    { label: "Savings Rate", value: "32%", status: "good" },
    { label: "Emergency Fund", value: "5 months", status: "good" },
    { label: "Credit Score", value: "750", status: "good" },
  ]

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Financial Health</h2>
      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <span className="text-slate-300">{metric.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{metric.value}</span>
              {metric.status === "good" ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
