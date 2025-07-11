"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Users } from "lucide-react"
import { useState } from "react"

export function TransferFunds() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  const recentContacts = [
    { name: "Alice Johnson", address: "0x1234...5678", avatar: "AJ" },
    { name: "Bob Smith", address: "0x9876...5432", avatar: "BS" },
    { name: "Carol Davis", address: "0x5555...1111", avatar: "CD" },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="send" className="text-white data-[state=active]:bg-purple-600">
            Send
          </TabsTrigger>
          <TabsTrigger value="request" className="text-white data-[state=active]:bg-purple-600">
            Request
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Send Stablecoins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-300">
                  Currency
                </Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="usdc">USDC - $2,450.75</SelectItem>
                    <SelectItem value="usdt">USDT - $1,200.00</SelectItem>
                    <SelectItem value="dai">DAI - $850.25</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center"
                />
                <div className="text-center text-gray-400 text-sm">≈ ${amount || "0.00"} USD</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-gray-300">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  placeholder="Enter wallet address or scan QR"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan QR
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Contacts
                </Button>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send ${amount || "0.00"}</Button>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Recent Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                  onClick={() => setRecipient(contact.address)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{contact.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{contact.name}</div>
                    <div className="text-gray-400 text-xs">{contact.address}</div>
                  </div>
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
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700 text-white text-2xl font-bold text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-gray-300">
                  Note (Optional)
                </Label>
                <Input id="note" placeholder="What's this for?" className="bg-gray-800 border-gray-700 text-white" />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Generate Payment Request</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
