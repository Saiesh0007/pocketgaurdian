import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const incomeData = [
  { name: "Salary", value: 3500 },
  { name: "Freelance", value: 500 },
  { name: "Investments", value: 200 },
]

const COLORS = ["#10b981", "#06b6d4", "#8b5cf6"]

export default function IncomeOverview() {
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Income Sources</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={incomeData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {incomeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-4">
        {incomeData.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-slate-300">{item.name}</span>
            <span className="text-white font-medium">${item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
