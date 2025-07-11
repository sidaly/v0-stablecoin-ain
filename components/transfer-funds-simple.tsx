"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QrCode, Clock, CheckCircle, XCircle, Plus, Users, Search, Filter, DollarSign, X } from "lucide-react"
import { useState, useMemo } from "react"

interface Transaction {
  id: number
  type: "transfer" | "request" | "deposit" | "withdrawal"
  description: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "cancelled"
  date: string
  recipient: string
  category?: string
  fee?: number
}

export function TransferFunds() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("usdc")
  const [description, setDescription] = useState("")
  const [isTransferPending, setIsTransferPending] = useState(false)
  const [isRequestPending, setIsRequestPending] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactAddress, setNewContactAddress] = useState("")

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFilter, setDateFilter] = useState("all") // all, today, week, month, custom
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currencyFilter, setCurrencyFilter] = useState("all")
  const [amountRangeMin, setAmountRangeMin] = useState("")
  const [amountRangeMax, setAmountRangeMax] = useState("")
  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")

  // Mock data for demonstration
  const wallets = [
    { id: "usdc", currency: "USDC", balance: 2450.75, address: "0x1234...5678" },
    { id: "usdt", currency: "USDT", balance: 1200.0, address: "0x9876...5432" },
    { id: "dai", currency: "DAI", balance: 850.25, address: "0x5555...1111" },
  ]

  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Johnson", address: "0x1234...5678", avatar: "AJ", favorite: true },
    { id: 2, name: "Bob Smith", address: "0x9876...5432", avatar: "BS", favorite: false },
    { id: 3, name: "Carol Davis", address: "0x5555...1111", avatar: "CD", favorite: false },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "transfer",
      description: "Payment for freelance work",
      amount: 500.0,
      currency: "USDC",
      status: "completed",
      date: "2024-01-15",
      recipient: "Alice Johnson",
      category: "Work",
      fee: 0.5,
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
      category: "Food",
      fee: 0.02,
    },
    {
      id: 3,
      type: "request",
      description: "Lunch split payment",
      amount: 25.0,
      currency: "DAI",
      status: "completed",
      date: "2024-01-13",
      recipient: "Carol Davis",
      category: "Food",
    },
    {
      id: 4,
      type: "deposit",
      description: "Bank transfer deposit",
      amount: 1000.0,
      currency: "USDC",
      status: "completed",
      date: "2024-01-12",
      recipient: "Bank Account",
      category: "Deposit",
    },
    {
      id: 5,
      type: "transfer",
      description: "Rent payment",
      amount: 1200.0,
      currency: "USDC",
      status: "completed",
      date: "2024-01-10",
      recipient: "Property Manager",
      category: "Bills",
      fee: 1.2,
    },
    {
      id: 6,
      type: "withdrawal",
      description: "ATM withdrawal",
      amount: 200.0,
      currency: "USDT",
      status: "completed",
      date: "2024-01-08",
      recipient: "ATM",
      category: "Cash",
      fee: 2.0,
    },
    {
      id: 7,
      type: "transfer",
      description: "Online shopping",
      amount: 89.99,
      currency: "USDC",
      status: "failed",
      date: "2024-01-07",
      recipient: "Amazon",
      category: "Shopping",
      fee: 0.09,
    },
    {
      id: 8,
      type: "transfer",
      description: "Subscription payment",
      amount: 9.99,
      currency: "DAI",
      status: "completed",
      date: "2024-01-05",
      recipient: "Netflix",
      category: "Entertainment",
      fee: 0.01,
    },
    {
      id: 9,
      type: "request",
      description: "Shared taxi fare",
      amount: 12.5,
      currency: "USDT",
      status: "cancelled",
      date: "2024-01-03",
      recipient: "John Doe",
      category: "Transport",
    },
    {
      id: 10,
      type: "transfer",
      description: "Grocery shopping",
      amount: 67.43,
      currency: "USDC",
      status: "completed",
      date: "2024-01-01",
      recipient: "Whole Foods",
      category: "Food",
      fee: 0.07,
    },
  ])

  // Filter transactions based on search and filter criteria
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(query) ||
          tx.recipient.toLowerCase().includes(query) ||
          tx.currency.toLowerCase().includes(query) ||
          tx.category?.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter)
    }

    // Currency filter
    if (currencyFilter !== "all") {
      filtered = filtered.filter((tx) => tx.currency === currencyFilter)
    }

    // Amount range filter
    if (amountRangeMin) {
      filtered = filtered.filter((tx) => tx.amount >= Number.parseFloat(amountRangeMin))
    }
    if (amountRangeMax) {
      filtered = filtered.filter((tx) => tx.amount <= Number.parseFloat(amountRangeMax))
    }

    // Date filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    if (dateFilter === "today") {
      filtered = filtered.filter((tx) => new Date(tx.date) >= today)
    } else if (dateFilter === "week") {
      filtered = filtered.filter((tx) => new Date(tx.date) >= weekAgo)
    } else if (dateFilter === "month") {
      filtered = filtered.filter((tx) => new Date(tx.date) >= monthAgo)
    } else if (dateFilter === "custom" && customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom)
      const toDate = new Date(customDateTo)
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date)
        return txDate >= fromDate && txDate <= toDate
      })
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [
    transactions,
    searchQuery,
    statusFilter,
    typeFilter,
    currencyFilter,
    amountRangeMin,
    amountRangeMax,
    dateFilter,
    customDateFrom,
    customDateTo,
  ])

  const clearAllFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setCurrencyFilter("all")
    setAmountRangeMin("")
    setAmountRangeMax("")
    setDateFilter("all")
    setCustomDateFrom("")
    setCustomDateTo("")
  }

  const activeFiltersCount = [
    searchQuery,
    statusFilter !== "all" ? statusFilter : "",
    typeFilter !== "all" ? typeFilter : "",
    currencyFilter !== "all" ? currencyFilter : "",
    amountRangeMin,
    amountRangeMax,
    dateFilter !== "all" ? dateFilter : "",
  ].filter(Boolean).length

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !recipient) return

    setIsTransferPending(true)

    // Simulate API call
    setTimeout(() => {
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        type: "transfer",
        description: description || "Transfer",
        amount: Number.parseFloat(amount),
        currency: wallets.find((w) => w.id === selectedWallet)?.currency || "USDC",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        recipient: recipientName || "Unknown",
        fee: Math.max(Number.parseFloat(amount) * 0.001, 0.01),
      }

      setTransactions([newTransaction, ...transactions])
      setAmount("")
      setRecipient("")
      setRecipientName("")
      setDescription("")
      setIsTransferPending(false)

      // Simulate status update to completed
      setTimeout(() => {
        setTransactions((prev) => prev.map((tx) => (tx.id === newTransaction.id ? { ...tx, status: "completed" } : tx)))
      }, 3000)
    }, 2000)
  }

  const handlePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const requestAmount = formData.get("amount") as string
    const requestDescription = formData.get("description") as string

    if (!requestAmount) return

    setIsRequestPending(true)

    // Simulate API call
    setTimeout(() => {
      const newRequest: Transaction = {
        id: transactions.length + 1,
        type: "request",
        description: requestDescription || "Payment Request",
        amount: Number.parseFloat(requestAmount),
        currency: "USDC",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        recipient: "Payment Request",
      }

      setTransactions([newRequest, ...transactions])
      setIsRequestPending(false)

      // Clear form
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

  const handleAddContact = () => {
    if (!newContactName || !newContactAddress) return

    const newContact = {
      id: contacts.length + 1,
      name: newContactName,
      address: newContactAddress,
      avatar: newContactName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      favorite: false,
    }

    setContacts([...contacts, newContact])
    setNewContactName("")
    setNewContactAddress("")
    setShowAddContact(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "cancelled":
        return <X className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "transfer":
        return "bg-purple-600"
      case "request":
        return "bg-blue-600"
      case "deposit":
        return "bg-green-600"
      case "withdrawal":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="send" className="text-white data-[state=active]:bg-purple-600">
            Send
          </TabsTrigger>
          <TabsTrigger value="request" className="text-white data-[state=active]:bg-purple-600">
            Request
          </TabsTrigger>
          <TabsTrigger value="history" className="text-white data-[state=active]:bg-purple-600">
            History ({filteredTransactions.length})
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
                    className="bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center"
                    required
                  />
                  <div className="text-center text-gray-400 text-sm">≈ ${amount || "0.00"} USD + ~$0.01 fee</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-gray-300">
                    Recipient Address
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="Enter wallet address"
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

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Scan QR
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isTransferPending || !amount || !recipient}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isTransferPending ? "Processing..." : `Send $${amount || "0.00"}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Add Contact Form */}
          {showAddContact && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Add New Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Contact Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input
                  placeholder="Wallet Address"
                  value={newContactAddress}
                  onChange={(e) => setNewContactAddress(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddContact} className="flex-1 bg-green-600 hover:bg-green-700">
                    Add Contact
                  </Button>
                  <Button
                    onClick={() => setShowAddContact(false)}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Contacts */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Recent Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => {
                    setRecipient(contact.address)
                    setRecipientName(contact.name)
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{contact.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{contact.name}</div>
                    <div className="text-gray-400 text-xs">{contact.address}</div>
                  </div>
                  {contact.favorite && (
                    <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                      ★
                    </Badge>
                  )}
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
            <CardContent>
              <form onSubmit={handlePaymentRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="request-amount" className="text-gray-300">
                    Amount to Request
                  </Label>
                  <Input
                    id="request-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request-description" className="text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="request-description"
                    name="description"
                    placeholder="What's this request for?"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isRequestPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isRequestPending ? "Creating..." : "Generate Payment Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Search Bar */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search transactions, recipients, amounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent relative"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center justify-between">
                  <span>Advanced Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-400 hover:text-white"
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="request">Request</SelectItem>
                        <SelectItem value="deposit">Deposit</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Currency</Label>
                    <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Currencies</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="DAI">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Date Range</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Custom Date Range */}
                {dateFilter === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">From Date</Label>
                      <Input
                        type="date"
                        value={customDateFrom}
                        onChange={(e) => setCustomDateFrom(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">To Date</Label>
                      <Input
                        type="date"
                        value={customDateTo}
                        onChange={(e) => setCustomDateTo(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Amount Range */}
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Amount Range
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Min amount"
                      value={amountRangeMin}
                      onChange={(e) => setAmountRangeMin(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Max amount"
                      value={amountRangeMax}
                      onChange={(e) => setAmountRangeMax(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          {(searchQuery || activeFiltersCount > 0) && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Transaction History */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Transaction History</span>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  {filteredTransactions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  {searchQuery || activeFiltersCount > 0 ? "No transactions match your filters" : "No transactions yet"}
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-white font-medium text-sm">{transaction.description}</div>
                          <Badge className={`text-xs ${getTypeColor(transaction.type)}`}>{transaction.type}</Badge>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(transaction.date).toLocaleDateString()} • To: {transaction.recipient}
                        </div>
                        {transaction.category && (
                          <div className="text-gray-500 text-xs">Category: {transaction.category}</div>
                        )}
                        {transaction.fee && (
                          <div className="text-gray-500 text-xs">Fee: ${transaction.fee.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toFixed(2)}{" "}
                        {transaction.currency}
                      </div>
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className={`text-xs ${
                          transaction.status === "completed"
                            ? "bg-green-600"
                            : transaction.status === "pending"
                              ? "bg-yellow-600"
                              : transaction.status === "failed"
                                ? "bg-red-600"
                                : "bg-gray-600"
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
