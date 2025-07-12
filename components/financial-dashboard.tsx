"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, AlertTriangle, PieChart, Calendar, DollarSign, Plus, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import {
  getUserBudgets,
  getUserExpenses,
  getUserFinancialGoals,
  getSpendingAnalytics,
  getFinancialAlerts,
} from "@/lib/financial-actions"

export function FinancialDashboard() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>({ analytics: [], totalSpent: 0 })
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    try {
      setLoading(true)
      const [budgetsResult, expensesResult, goalsResult, analyticsResult, alertsResult] = await Promise.all([
        getUserBudgets(userId),
        getUserExpenses(userId, 10),
        getUserFinancialGoals(userId),
        getSpendingAnalytics(userId, "month"),
        getFinancialAlerts(userId),
      ])

      if (budgetsResult.success) setBudgets(budgetsResult.budgets)
      if (expensesResult.success) setExpenses(expensesResult.expenses)
      if (goalsResult.success) setGoals(goalsResult.goals)
      if (analyticsResult.success) setAnalytics(analyticsResult)
      if (alertsResult.success) setAlerts(alertsResult.alerts)
    } catch (error) {
      console.error("Error loading financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getBudgetStatus = (spent: number, total: number) => {
    const percentage = (spent / total) * 100
    if (percentage >= 100) return { status: "exceeded", color: "bg-red-500", text: "Exceeded" }
    if (percentage >= 90) return { status: "critical", color: "bg-red-400", text: "Critical" }
    if (percentage >= 75) return { status: "warning", color: "bg-yellow-500", text: "Warning" }
    return { status: "good", color: "bg-green-500", text: "On Track" }
  }

  const getGoalProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Loading Financial Data...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Monthly Spent</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">{formatCurrency(analytics.totalSpent)}</div>
            <div className="text-green-400 text-xs">This month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Active Goals</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">{goals.filter((g) => g.status === "active").length}</div>
            <div className="text-blue-400 text-xs">In progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Financial Alerts ({alerts.filter((a) => !a.is_read).length} unread)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      alert.severity === "critical"
                        ? "text-red-400"
                        : alert.severity === "warning"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  />
                  <div>
                    <div className="text-white text-sm font-medium">{alert.title}</div>
                    <div className="text-gray-400 text-xs">{alert.message}</div>
                  </div>
                </div>
                {!alert.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="budgets" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="budgets" className="text-white data-[state=active]:bg-purple-600">
            Budgets
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-white data-[state=active]:bg-purple-600">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-white data-[state=active]:bg-purple-600">
            Goals
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Active Budgets</h3>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Budget
            </Button>
          </div>

          {budgets.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">No budgets created yet</div>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Create Your First Budget</Button>
              </CardContent>
            </Card>
          ) : (
            budgets.map((budget) => {
              const budgetStatus = getBudgetStatus(
                Number.parseFloat(budget.spent_amount),
                Number.parseFloat(budget.total_amount),
              )
              const percentage = (Number.parseFloat(budget.spent_amount) / Number.parseFloat(budget.total_amount)) * 100

              return (
                <Card key={budget.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{budget.name}</CardTitle>
                      <Badge className={budgetStatus.color}>{budgetStatus.text}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Spent: {formatCurrency(Number.parseFloat(budget.spent_amount))}
                      </span>
                      <span className="text-gray-400">
                        Budget: {formatCurrency(Number.parseFloat(budget.total_amount))}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2 bg-gray-800" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">
                        Remaining:{" "}
                        {formatCurrency(
                          Number.parseFloat(budget.total_amount) - Number.parseFloat(budget.spent_amount),
                        )}
                      </span>
                      <span className="text-gray-400">{percentage.toFixed(1)}% used</span>
                    </div>

                    {/* Budget Categories */}
                    {budget.categories && budget.categories.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-white text-sm font-medium">Categories</div>
                        {budget.categories.slice(0, 3).map((category: any) => (
                          <div key={category.category_id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.category_color }}
                              ></div>
                              <span className="text-gray-300">{category.category_name}</span>
                            </div>
                            <span className="text-gray-400">
                              {formatCurrency(Number.parseFloat(category.spent_amount))} /{" "}
                              {formatCurrency(Number.parseFloat(category.allocated_amount))}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Recent Expenses</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {expenses.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">No expenses recorded yet</div>
                <Button className="mt-4 bg-green-600 hover:bg-green-700">Add Your First Expense</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <Card key={expense.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: expense.category_color }}
                        >
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{expense.description}</div>
                          <div className="text-gray-400 text-xs">
                            {expense.merchant_name && `${expense.merchant_name} • `}
                            {new Date(expense.transaction_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500 text-xs">{expense.category_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-red-400 font-semibold">
                          -{formatCurrency(Number.parseFloat(expense.amount))}
                        </div>
                        <div className="text-gray-400 text-xs">{expense.currency}</div>
                      </div>
                    </div>
                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {expense.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Financial Goals</h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>

          {goals.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">No financial goals set yet</div>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Set Your First Goal</Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const progress = getGoalProgress(
                Number.parseFloat(goal.current_amount),
                Number.parseFloat(goal.target_amount),
              )
              const remaining = Number.parseFloat(goal.target_amount) - Number.parseFloat(goal.current_amount)

              return (
                <Card key={goal.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
                      <Badge
                        className={
                          goal.status === "completed"
                            ? "bg-green-600"
                            : goal.priority === "high"
                              ? "bg-red-600"
                              : goal.priority === "medium"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                        }
                      >
                        {goal.status === "completed" ? "Completed" : goal.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {goal.description && <p className="text-gray-400 text-sm">{goal.description}</p>}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Progress: {formatCurrency(Number.parseFloat(goal.current_amount))}
                      </span>
                      <span className="text-gray-400">
                        Target: {formatCurrency(Number.parseFloat(goal.target_amount))}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-800" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400">Remaining: {formatCurrency(remaining)}</span>
                      <span className="text-gray-400">{progress.toFixed(1)}% complete</span>
                    </div>

                    {goal.target_date && (
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-white font-semibold">Spending Analytics</h3>

          {analytics.analytics.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400">No spending data available</div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Spending by Category (This Month)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.analytics.map((category: any) => {
                  const percentage = (Number.parseFloat(category.total_amount) / analytics.totalSpent) * 100

                  return (
                    <div key={category.category_name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.category_color }}
                          ></div>
                          <span className="text-white font-medium text-sm">{category.category_name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold text-sm">
                            {formatCurrency(Number.parseFloat(category.total_amount))}
                          </div>
                          <div className="text-gray-400 text-xs">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1 bg-gray-800" />
                      <div className="text-xs text-gray-400">
                        {category.transaction_count} transactions • Avg:{" "}
                        {formatCurrency(Number.parseFloat(category.average_amount))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
