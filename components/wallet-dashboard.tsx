"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Plus, Send, ArrowDownLeft } from "lucide-react"
import { useState } from "react"

export function WalletDashboard() {
  const [showBalance, setShowBalance] = useState(true)

  const stablecoins = [
    { name: "USDC", symbol: "USDC", balance: 2450.75, change: "+2.3%" },
    { name: "USDT", symbol: "USDT", balance: 1200.0, change: "+0.1%" },
    { name: "DAI", symbol: "DAI", balance: 850.25, change: "+1.8%" },
  ]

  const totalBalance = stablecoins.reduce((sum, coin) => sum + coin.balance, 0)

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Total Balance</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white"
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mb-2">
            {showBalance ? `$${totalBalance.toLocaleString()}` : "••••••"}
          </div>
          <div className="text-green-400 text-sm">+$127.50 (2.8%) today</div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex flex-col py-6">
          <Plus className="w-6 h-6 mb-2" />
          <span className="text-sm">Add Funds</span>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col py-6">
          <Send className="w-6 h-6 mb-2" />
          <span className="text-sm">Send</span>
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex flex-col py-6">
          <ArrowDownLeft className="w-6 h-6 mb-2" />
          <span className="text-sm">Receive</span>
        </Button>
      </div>

      {/* Stablecoin Holdings */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">Your Stablecoins</h3>
        {stablecoins.map((coin) => (
          <Card key={coin.symbol} className="bg-gray-900/50 border-gray-800">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{coin.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{coin.name}</div>
                  <div className="text-gray-400 text-sm">{coin.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">
                  {showBalance ? `$${coin.balance.toLocaleString()}` : "••••"}
                </div>
                <div className="text-green-400 text-sm">{coin.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
