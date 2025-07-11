"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"
import { useState } from "react"

export function TransferTest() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Transfer Funds - Test Component
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white text-xl font-bold text-center"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Recipient</Label>
            <Input
              placeholder="Enter wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Send ${amount || "0.00"}</Button>
        </CardContent>
      </Card>

      <Card className="bg-green-900/20 border-green-800">
        <CardContent className="p-4">
          <div className="text-green-400 font-semibold">✅ Transfer Component Loaded Successfully!</div>
          <div className="text-gray-300 text-sm mt-1">
            If you can see this, the transfer module is working correctly.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
