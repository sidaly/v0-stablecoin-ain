"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Target, Calendar } from "lucide-react"
import { useState, useActionState } from "react"
import { createBudget } from "@/lib/financial-actions"

export function BudgetForm() {
  const [budgetType, setBudgetType] = useState("monthly")

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  const [budgetState, budgetAction, isPending] = useActionState(createBudget, null)

  const getBudgetDates = (type: string) => {
    const now = new Date()
    let startDate: string
    let endDate: string

    switch (type) {
      case "weekly":
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))
        startDate = startOfWeek.toISOString().split("T")[0]
        endDate = endOfWeek.toISOString().split("T")[0]
        break
      case "yearly":
        startDate = `${now.getFullYear()}-01-01`
        endDate = `${now.getFullYear()}-12-31`
        break
      case "monthly":
      default:
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        startDate = startOfMonth.toISOString().split("T")[0]
        endDate = endOfMonth.toISOString().split("T")[0]
        break
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getBudgetDates(budgetType)

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Create New Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={budgetAction} className="space-y-4">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="budgetType" value={budgetType} />
          <input type="hidden" name="startDate" value={startDate} />
          <input type="hidden" name="endDate" value={endDate} />

          <div className="space-y-2">
            <Label className="text-gray-300">Budget Name</Label>
            <Input
              name="name"
              placeholder="e.g., Monthly Expenses, Food Budget"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Description (Optional)</Label>
            <Textarea
              name="description"
              placeholder="What is this budget for?"
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Budget Amount</Label>
              <Input
                name="totalAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-gray-800 border-gray-700 text-white text-xl font-bold text-center"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Currency</Label>
              <Select name="currency" defaultValue="USD">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Budget Period</Label>
            <Select value={budgetType} onValueChange={setBudgetType}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Period</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                className="bg-gray-800 border-gray-700 text-white"
                readOnly={budgetType !== "custom"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                End Date
              </Label>
              <Input
                type="date"
                value={endDate}
                className="bg-gray-800 border-gray-700 text-white"
                readOnly={budgetType !== "custom"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Alert Threshold (%)</Label>
            <Select name="alertThreshold" defaultValue="80">
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="50">50% - Early Warning</SelectItem>
                <SelectItem value="75">75% - Standard</SelectItem>
                <SelectItem value="80">80% - Recommended</SelectItem>
                <SelectItem value="90">90% - Late Warning</SelectItem>
                <SelectItem value="95">95% - Critical Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-gray-400 text-xs">
              You'll receive an alert when you reach this percentage of your budget
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            {isPending ? "Creating Budget..." : "Create Budget"}
          </Button>

          {budgetState?.success && (
            <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="text-green-400 text-sm">{budgetState.message}</div>
            </div>
          )}

          {budgetState?.error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <div className="text-red-400 text-sm">{budgetState.error}</div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
