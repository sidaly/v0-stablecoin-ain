"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Car, Coffee, Home } from "lucide-react"

export function AnalyticsDashboard() {
  const monthlyStats = {
    totalSpent: 3245.67,
    totalReceived: 4567.89,
    netFlow: 1322.22,
    transactionCount: 127,
  }

  const categories = [
    { name: "Shopping", amount: 1245.67, percentage: 38, icon: ShoppingCart, color: "bg-purple-500" },
    { name: "Transportation", amount: 567.89, percentage: 17, icon: Car, color: "bg-blue-500" },
    { name: "Food & Dining", amount: 432.11, percentage: 13, icon: Coffee, color: "bg-green-500" },
    { name: "Bills & Utilities", amount: 890.0, percentage: 27, icon: Home, color: "bg-orange-500" },
  ]

  const recentTransactions = [
    { id: 1, type: "expense", description: "Amazon Purchase", amount: -89.99, category: "Shopping", date: "Today" },
    { id: 2, type: "income", description: "Salary Deposit", amount: 2500.0, category: "Income", date: "Yesterday" },
    { id: 3, type: "expense", description: "Uber Ride", amount: -15.5, category: "Transportation", date: "Yesterday" },
    { id: 4, type: "expense", description: "Starbucks", amount: -6.75, category: "Food", date: "2 days ago" },
    { id: 5, type: "expense", description: "Netflix", amount: -15.99, category: "Entertainment", date: "3 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Income</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">${monthlyStats.totalReceived.toLocaleString()}</div>
            <div className="text-green-400 text-xs">+12.5% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-gray-400 text-sm">Expenses</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">${monthlyStats.totalSpent.toLocaleString()}</div>
            <div className="text-red-400 text-xs">+8.3% from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Net Flow */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm">Net Flow This Month</div>
              <div className="text-white text-2xl font-bold">+${monthlyStats.netFlow.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Transactions</div>
              <div className="text-white text-xl font-semibold">{monthlyStats.transactionCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Categories */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${category.amount.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">{category.percentage}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 ${category.color} rounded-full`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{transaction.description}</div>
                  <div className="text-gray-400 text-xs">{transaction.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </div>
                <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
