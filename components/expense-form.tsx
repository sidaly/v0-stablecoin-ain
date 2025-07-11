"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt } from "lucide-react"
import { useState, useEffect, useActionState } from "react"
import { addExpense, getUserCategories, getUserBudgets } from "@/lib/financial-actions"
import { getUserWallets } from "@/lib/transfer-actions"

export function ExpenseForm() {
  const [categories, setCategories] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBudget, setSelectedBudget] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("wallet")

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  const [expenseState, expenseAction, isPending] = useActionState(addExpense, null)

  useEffect(() => {
    loadFormData()
  }, [])

  useEffect(() => {
    if (expenseState?.success) {
      console.log("Expense Added:", expenseState.message)
      // Reset form or show success message
    } else if (expenseState?.error) {
      console.error("Error adding expense:", expenseState.error)
    }
  }, [expenseState])

  const loadFormData = async () => {
    try {
      const [categoriesResult, budgetsResult, walletsResult] = await Promise.all([
        getUserCategories(userId),
        getUserBudgets(userId),
        getUserWallets(userId),
      ])

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
        if (categoriesResult.categories.length > 0) {
          setSelectedCategory(categoriesResult.categories[0].id)
        }
      }

      if (budgetsResult.success) {
        setBudgets(budgetsResult.budgets.filter((b: any) => b.status === "active"))
        if (budgetsResult.budgets.length > 0) {
          setSelectedBudget(budgetsResult.budgets[0].id)
        }
      }

      if (walletsResult.success) {
        setWallets(walletsResult.wallets)
        if (walletsResult.wallets.length > 0) {
          setSelectedWallet(walletsResult.wallets[0].id)
        }
      }
    } catch (error) {
      console.error("Error loading form data:", error)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={expenseAction} className="space-y-4">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="categoryId" value={selectedCategory} />
          <input type="hidden" name="budgetId" value={selectedBudget} />
          <input type="hidden" name="walletId" value={selectedWallet} />
          <input type="hidden" name="paymentMethod" value={paymentMethod} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Amount</Label>
              <Input
                name="amount"
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
            <Label className="text-gray-300">Description</Label>
            <Input
              name="description"
              placeholder="What did you spend on?"
              className="bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Budget (Optional)</Label>
            <Select value={selectedBudget} onValueChange={setSelectedBudget}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="no_budget">No Budget</SelectItem>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Merchant</Label>
              <Input
                name="merchantName"
                placeholder="Store or merchant name"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Location</Label>
              <Input name="location" placeholder="City or address" className="bg-gray-800 border-gray-700 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "wallet" && (
            <div className="space-y-2">
              <Label className="text-gray-300">Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.currency} - ${Number.parseFloat(wallet.balance).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-300">Tags (Optional)</Label>
            <Input
              name="tags"
              placeholder="food, work, travel (comma separated)"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white">
            {isPending ? "Adding Expense..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
