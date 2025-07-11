"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, AlertTriangle, PieChart, DollarSign, Plus, Database } from "lucide-react"
import { useState } from "react"

export function FinancialDashboardSimple() {
  const [showSetup, setShowSetup] = useState(true)

  // Mock data for demonstration
  const mockBudgets = [
    {
      id: 1,
      name: "Monthly Budget - January 2024",
      total_amount: 3000,
      spent_amount: 1850.75,
      currency: "USD",
      status: "active",
      categories: [
        { category_name: "Food & Dining", category_color: "#10B981", allocated_amount: 800, spent_amount: 620.5 },
        { category_name: "Transportation", category_color: "#3B82F6", allocated_amount: 400, spent_amount: 285.25 },
        { category_name: "Entertainment", category_color: "#F59E0B", allocated_amount: 300, spent_amount: 145.0 },
      ],
    },
    {
      id: 2,
      name: "Food Budget",
      total_amount: 800,
      spent_amount: 620.5,
      currency: "USD",
      status: "active",
      categories: [],
    },
  ]

  const mockExpenses = [
    {
      id: 1,
      description: "Grocery shopping at Whole Foods",
      amount: 45.67,
      currency: "USD",
      merchant_name: "Whole Foods Market",
      transaction_date: new Date().toISOString(),
      category_name: "Food & Dining",
      category_color: "#10B981",
      tags: ["groceries", "organic"],
    },
    {
      id: 2,
      description: "Uber ride to downtown",
      amount: 25.5,
      currency: "USD",
      merchant_name: "Uber",
      transaction_date: new Date(Date.now() - 86400000).toISOString(),
      category_name: "Transportation",
      category_color: "#3B82F6",
      tags: ["rideshare", "work"],
    },
    {
      id: 3,
      description: "Netflix monthly subscription",
      amount: 15.99,
      currency: "USD",
      merchant_name: "Netflix",
      transaction_date: new Date(Date.now() - 172800000).toISOString(),
      category_name: "Entertainment",
      category_color: "#F59E0B",
      tags: ["streaming", "subscription"],
    },
  ]

  const mockGoals = [
    {
      id: 1,
      title: "Emergency Fund",
      description: "Build emergency fund for 6 months expenses",
      target_amount: 15000,
      current_amount: 3500,
      currency: "USD",
      target_date: "2024-12-31",
      status: "active",
      priority: "high",
    },
    {
      id: 2,
      title: "Vacation Fund",
      description: "Save for summer vacation to Europe",
      target_amount: 5000,
      current_amount: 1200,
      currency: "USD",
      target_date: "2024-06-01",
      status: "active",
      priority: "medium",
    },
  ]

  const mockAnalytics = [
    { category_name: "Food & Dining", category_color: "#10B981", total_amount: 620.5, transaction_count: 15 },
    { category_name: "Transportation", category_color: "#3B82F6", total_amount: 285.25, transaction_count: 8 },
    { category_name: "Entertainment", category_color: "#F59E0B", total_amount: 145.0, transaction_count: 5 },
    { category_name: "Shopping", category_color: "#8B5CF6", total_amount: 320.8, transaction_count: 6 },
  ]

  const totalSpent = mockAnalytics.reduce((sum, cat) => sum + cat.total_amount, 0)

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

  if (showSetup) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-400" />
              Financial Management Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Welcome to Financial Management! This module helps you track expenses, manage budgets, and achieve
              financial goals.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Features Include:</h4>
              <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                <li>Budget tracking with automatic alerts</li>
                <li>Expense categorization and analysis</li>
                <li>Financial goal setting and progress tracking</li>
                <li>Integration with wallet transactions</li>
                <li>Detailed spending analytics</li>
              </ul>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">Database Setup Required:</h4>
              <p className="text-gray-300 text-sm mb-3">
                To use the full financial management features, run the database setup scripts to create the necessary
                tables.
              </p>
              <div className="text-xs text-gray-400 font-mono bg-gray-900 p-2 rounded">
                1. scripts/create-financial-management-tables.sql
                <br />
                2. scripts/seed-financial-management-data.sql
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => setShowSetup(false)} className="flex-1 bg-purple-600 hover:bg-purple-700">
                View Demo Data
              </Button>
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 bg-transparent">
                Setup Instructions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Demo Mode</span>
          </div>
          <p className="text-gray-300 text-sm mt-1">
            This is sample data. Run the database setup scripts to use real financial tracking.
          </p>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Monthly Spent</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">{formatCurrency(totalSpent)}</div>
            <div className="text-green-400 text-xs">This month</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Active Goals</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">{mockGoals.length}</div>
            <div className="text-blue-400 text-xs">In progress</div>
          </CardContent>
        </Card>
      </div>

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
            <h3 className="text-white font-semibold">Demo Budgets</h3>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Budget
            </Button>
          </div>

          {mockBudgets.map((budget) => {
            const budgetStatus = getBudgetStatus(budget.spent_amount, budget.total_amount)
            const percentage = (budget.spent_amount / budget.total_amount) * 100

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
                    <span className="text-gray-400">Spent: {formatCurrency(budget.spent_amount)}</span>
                    <span className="text-gray-400">Budget: {formatCurrency(budget.total_amount)}</span>
                  </div>
                  <Progress value={percentage} className="h-2 bg-gray-800" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">
                      Remaining: {formatCurrency(budget.total_amount - budget.spent_amount)}
                    </span>
                    <span className="text-gray-400">{percentage.toFixed(1)}% used</span>
                  </div>

                  {budget.categories.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-white text-sm font-medium">Categories</div>
                      {budget.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.category_color }}
                            ></div>
                            <span className="text-gray-300">{category.category_name}</span>
                          </div>
                          <span className="text-gray-400">
                            {formatCurrency(category.spent_amount)} / {formatCurrency(category.allocated_amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Demo Expenses</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>

          <div className="space-y-3">
            {mockExpenses.map((expense) => (
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
                          {expense.merchant_name} • {new Date(expense.transaction_date).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">{expense.category_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">-{formatCurrency(expense.amount)}</div>
                      <div className="text-gray-400 text-xs">{expense.currency}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {expense.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Demo Goals</h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>

          {mockGoals.map((goal) => {
            const progress = getGoalProgress(goal.current_amount, goal.target_amount)
            const remaining = goal.target_amount - goal.current_amount

            return (
              <Card key={goal.id} className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
                    <Badge className={goal.priority === "high" ? "bg-red-600" : "bg-yellow-600"}>{goal.priority}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">{goal.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress: {formatCurrency(goal.current_amount)}</span>
                    <span className="text-gray-400">Target: {formatCurrency(goal.target_amount)}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-800" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-400">Remaining: {formatCurrency(remaining)}</span>
                    <span className="text-gray-400">{progress.toFixed(1)}% complete</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-white font-semibold">Demo Analytics</h3>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center">
                <PieChart className="w-4 h-4 mr-2" />
                Spending by Category (Demo Data)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnalytics.map((category) => {
                const percentage = (category.total_amount / totalSpent) * 100

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
                        <div className="text-white font-semibold text-sm">{formatCurrency(category.total_amount)}</div>
                        <div className="text-gray-400 text-xs">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1 bg-gray-800" />
                    <div className="text-xs text-gray-400">{category.transaction_count} transactions</div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
