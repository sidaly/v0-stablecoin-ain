"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { QrCode, CheckCircle, Users, Send, ArrowDownLeft, AlertTriangle, Shield } from "lucide-react"
import { useState } from "react"
import { TransferLimitsComponent } from "@/components/transfer-limits"

interface TransferLimits {
  dailyLimit: number
  monthlyLimit: number
  dailyUsed: number
  monthlyUsed: number
  limitsEnabled: boolean
  lastResetDate: string
}

export function TransferWorking() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("usdc")
  const [description, setDescription] = useState("")
  const [isTransferPending, setIsTransferPending] = useState(false)

  // Transfer Limits State
  const [transferLimits, setTransferLimits] = useState<TransferLimits>({
    dailyLimit: 1000,
    monthlyLimit: 25000,
    dailyUsed: 350.75,
    monthlyUsed: 8750.5,
    limitsEnabled: true,
    lastResetDate: new Date().toISOString().split("T")[0],
  })

  // Mock wallet data
  const wallets = [
    { id: "usdc", currency: "USDC", balance: 2450.75 },
    { id: "usdt", currency: "USDT", balance: 1200.0 },
    { id: "dai", currency: "DAI", balance: 850.25 },
  ]

  const contacts = [
    { id: 1, name: "Alice Johnson", address: "0x1234...5678", avatar: "AJ" },
    { id: 2, name: "Bob Smith", address: "0x9876...5432", avatar: "BS" },
    { id: 3, name: "Carol Davis", address: "0x5555...1111", avatar: "CD" },
  ]

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "transfer",
      description: "Payment to Alice",
      amount: 100.0,
      currency: "USDC",
      status: "completed",
      date: "2024-01-15",
      recipient: "Alice Johnson",
    },
    {
      id: 2,
      type: "transfer",
      description: "Coffee payment",
      amount: 15.5,
      currency: "USDT",
      status: "pending",
      date: "2024-01-14",
      recipient: "Bob Smith",
    },
  ])

  // Limit validation functions
  const validateTransferLimits = (transferAmount: number) => {
    if (!transferLimits.limitsEnabled) return { valid: true, message: "" }

    const dailyRemaining = transferLimits.dailyLimit - transferLimits.dailyUsed
    const monthlyRemaining = transferLimits.monthlyLimit - transferLimits.monthlyUsed

    if (transferAmount > dailyRemaining) {
      return {
        valid: false,
        message: `Transfer exceeds daily limit. Available: $${dailyRemaining.toFixed(2)}`,
      }
    }

    if (transferAmount > monthlyRemaining) {
      return {
        valid: false,
        message: `Transfer exceeds monthly limit. Available: $${monthlyRemaining.toFixed(2)}`,
      }
    }

    return { valid: true, message: "" }
  }

  const getLimitWarning = (transferAmount: number) => {
    if (!transferLimits.limitsEnabled || !transferAmount) return null

    const newDailyUsed = transferLimits.dailyUsed + transferAmount
    const newMonthlyUsed = transferLimits.monthlyUsed + transferAmount

    const dailyPercentage = (newDailyUsed / transferLimits.dailyLimit) * 100
    const monthlyPercentage = (newMonthlyUsed / transferLimits.monthlyLimit) * 100

    if (dailyPercentage >= 90 || monthlyPercentage >= 90) {
      return "This transfer will use most of your remaining limit"
    }
    if (dailyPercentage >= 75 || monthlyPercentage >= 75) {
      return "This transfer will significantly reduce your remaining limit"
    }
    return null
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !recipient) return

    const transferAmount = Number.parseFloat(amount)
    const validation = validateTransferLimits(transferAmount)

    if (!validation.valid) {
      alert(validation.message)
      return
    }

    setIsTransferPending(true)

    // Simulate transfer
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        type: "transfer",
        description: description || "Transfer",
        amount: transferAmount,
        currency: wallets.find((w) => w.id === selectedWallet)?.currency || "USDC",
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        recipient: recipient,
      }

      setTransactions([newTransaction, ...transactions])

      // Update transfer limits usage
      if (transferLimits.limitsEnabled) {
        setTransferLimits((prev) => ({
          ...prev,
          dailyUsed: prev.dailyUsed + transferAmount,
          monthlyUsed: prev.monthlyUsed + transferAmount,
        }))
      }

      setAmount("")
      setRecipient("")
      setDescription("")
      setIsTransferPending(false)
    }, 2000)
  }

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet)
  const transferAmount = Number.parseFloat(amount) || 0
  const limitValidation = validateTransferLimits(transferAmount)
  const limitWarning = getLimitWarning(transferAmount)

  const dailyRemaining = Math.max(0, transferLimits.dailyLimit - transferLimits.dailyUsed)
  const monthlyRemaining = Math.max(0, transferLimits.monthlyLimit - transferLimits.monthlyUsed)

  return (
    <div className="space-y-6">
      {/* Transfer Limits Overview */}
      {transferLimits.limitsEnabled && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium text-sm">Transfer Limits</span>
              </div>
              <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                Active
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Daily Remaining</div>
                <div className="text-white font-semibold">${dailyRemaining.toLocaleString()}</div>
                <Progress
                  value={(transferLimits.dailyUsed / transferLimits.dailyLimit) * 100}
                  className="h-1 mt-1 bg-gray-800"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Monthly Remaining</div>
                <div className="text-white font-semibold">${monthlyRemaining.toLocaleString()}</div>
                <Progress
                  value={(transferLimits.monthlyUsed / transferLimits.monthlyLimit) * 100}
                  className="h-1 mt-1 bg-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex flex-col py-6">
          <Send className="w-6 h-6 mb-2" />
          <span className="text-sm">Send</span>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col py-6">
          <ArrowDownLeft className="w-6 h-6 mb-2" />
          <span className="text-sm">Request</span>
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex flex-col py-6">
          <QrCode className="w-6 h-6 mb-2" />
          <span className="text-sm">Scan QR</span>
        </Button>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="send" className="text-white data-[state=active]:bg-purple-600">
            Send
          </TabsTrigger>
          <TabsTrigger value="request" className="text-white data-[state=active]:bg-purple-600">
            Request
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-purple-600">
            History
          </TabsTrigger>
          <TabsTrigger value="limits" className="text-white data-[state=active]:bg-purple-600">
            Limits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Send Stablecoins</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet" className="text-gray-300">
                    From Wallet
                  </Label>
                  <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.currency} - ${wallet.balance.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWalletData && (
                    <div className="text-sm text-gray-400">
                      Available: ${selectedWalletData.balance.toLocaleString()} {selectedWalletData.currency}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center ${
                      !limitValidation.valid ? "border-red-500" : ""
                    }`}
                    required
                  />
                  <div className="text-center text-gray-400 text-sm">≈ ${amount || "0.00"} USD + ~$0.01 fee</div>

                  {/* Limit Validation Messages */}
                  {transferAmount > 0 && transferLimits.limitsEnabled && (
                    <div className="space-y-2">
                      {!limitValidation.valid && (
                        <div className="flex items-center space-x-2 p-2 bg-red-900/20 border border-red-800 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">{limitValidation.message}</span>
                        </div>
                      )}
                      {limitValidation.valid && limitWarning && (
                        <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm">{limitWarning}</span>
                        </div>
                      )}
                      {limitValidation.valid && (
                        <div className="text-xs text-gray-400 text-center">
                          After transfer: Daily ${(transferLimits.dailyUsed + transferAmount).toFixed(2)}/$
                          {transferLimits.dailyLimit} • Monthly $
                          {(transferLimits.monthlyUsed + transferAmount).toFixed(2)}/${transferLimits.monthlyLimit}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-gray-300">
                    Recipient Address
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="Enter wallet address or select contact"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description (Optional)
                  </Label>
                  <Input
                    id="description"
                    placeholder="What's this for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isTransferPending || !amount || !recipient || !limitValidation.valid}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isTransferPending ? "Processing Transfer..." : `Send $${amount || "0.00"}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Quick Send to Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors border border-gray-700"
                  onClick={() => setRecipient(contact.address)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{contact.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{contact.name}</div>
                    <div className="text-gray-400 text-sm">{contact.address}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      setRecipient(contact.address)
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Request Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-amount" className="text-gray-300">
                  Amount to Request
                </Label>
                <Input
                  id="request-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-description" className="text-gray-300">
                  Description
                </Label>
                <Input
                  id="request-description"
                  placeholder="What's this request for?"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Generate Payment Request</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-white font-medium text-sm">{transaction.description}</div>
                      <div className="text-gray-400 text-xs">
                        {transaction.date} • To: {transaction.recipient}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      -${transaction.amount.toFixed(2)} {transaction.currency}
                    </div>
                    <Badge className="text-xs bg-green-600">{transaction.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <TransferLimitsComponent limits={transferLimits} onUpdateLimits={setTransferLimits} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
