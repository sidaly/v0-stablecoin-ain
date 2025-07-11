"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QrCode, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { useState, useEffect, useActionState } from "react"
import {
  createTransfer,
  createPaymentRequest,
  getUserWallets,
  getUserContacts,
  addContact,
  getTransactionHistory,
} from "@/lib/transfer-actions"
// Remove this import
// import { useToast } from "@/hooks/use-toast"

export function TransferFunds() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [selectedWallet, setSelectedWallet] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USDC")
  const [description, setDescription] = useState("")
  const [wallets, setWallets] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactAddress, setNewContactAddress] = useState("")

  // Remove the toast hook usage
  // const { toast } = useToast()

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  const [transferState, transferAction, isTransferPending] = useActionState(createTransfer, null)
  const [requestState, requestAction, isRequestPending] = useActionState(createPaymentRequest, null)

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (transferState?.success) {
      console.log("Transfer Successful:", transferState.message)
      setAmount("")
      setRecipient("")
      setDescription("")
      loadUserData() // Refresh data
    } else if (transferState?.error) {
      console.error("Transfer Failed:", transferState.error)
    }
  }, [transferState])

  useEffect(() => {
    if (requestState?.success) {
      console.log("Payment Request Created:", requestState.message)
      setAmount("")
      setDescription("")
    } else if (requestState?.error) {
      console.error("Request Failed:", requestState.error)
    }
  }, [requestState])

  const loadUserData = async () => {
    try {
      const [walletsResult, contactsResult, transactionsResult] = await Promise.all([
        getUserWallets(userId),
        getUserContacts(userId),
        getTransactionHistory(userId, 10),
      ])

      if (walletsResult.success) {
        setWallets(walletsResult.wallets)
        if (walletsResult.wallets.length > 0 && !selectedWallet) {
          setSelectedWallet(walletsResult.wallets[0].id)
        }
      }

      if (contactsResult.success) {
        setContacts(contactsResult.contacts)
      }

      if (transactionsResult.success) {
        setTransactions(transactionsResult.transactions)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleAddContact = async () => {
    if (!newContactName || !newContactAddress) return

    const result = await addContact(userId, newContactName, newContactAddress)
    if (result.success) {
      console.log("Contact Added:", `${newContactName} has been added to your contacts`)
      setNewContactName("")
      setNewContactAddress("")
      setShowAddContact(false)
      loadUserData()
    } else {
      console.error("Error adding contact:", result.error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
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
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Send Stablecoins</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={transferAction} className="space-y-4">
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="fromWalletId" value={selectedWallet} />
                <input type="hidden" name="currency" value={selectedCurrency} />
                <input type="hidden" name="recipientName" value={recipientName} />

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
                          {wallet.currency} - ${Number.parseFloat(wallet.balance).toLocaleString()}
                          {wallet.is_primary && " (Primary)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedWalletData && (
                    <div className="text-sm text-gray-400">
                      Available: ${Number.parseFloat(selectedWalletData.balance).toLocaleString()}{" "}
                      {selectedWalletData.currency}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
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
                    name="toAddress"
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
                    name="description"
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
                  disabled={isTransferPending || !amount || !recipient || !selectedWallet}
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
          {contacts.length > 0 && (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Recent Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setRecipient(contact.contact_address)
                      setRecipientName(contact.contact_name)
                    }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {contact.contact_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{contact.contact_name}</div>
                      <div className="text-gray-400 text-xs">
                        {contact.contact_address.slice(0, 10)}...{contact.contact_address.slice(-8)}
                      </div>
                    </div>
                    {contact.is_favorite && (
                      <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                        ★
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Request Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={requestAction} className="space-y-4">
                <input type="hidden" name="requesterId" value={userId} />
                <input type="hidden" name="currency" value={selectedCurrency} />

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
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No transactions yet</div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="text-white font-medium text-sm">
                          {transaction.transaction_type === "transfer" ? "Transfer" : transaction.transaction_type}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                        {transaction.description && (
                          <div className="text-gray-400 text-xs">{transaction.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        -{Number.parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
                      </div>
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className={`text-xs ${
                          transaction.status === "completed"
                            ? "bg-green-600"
                            : transaction.status === "pending"
                              ? "bg-yellow-600"
                              : "bg-red-600"
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
