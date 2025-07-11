"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Eye, EyeOff, MoreVertical } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CardsManagement() {
  const [showCardNumbers, setShowCardNumbers] = useState(false)

  const cards = [
    {
      id: 1,
      name: "Primary Card",
      type: "Virtual",
      number: "4532 1234 5678 9012",
      balance: 2450.75,
      status: "Active",
      color: "from-purple-600 to-blue-600",
    },
    {
      id: 2,
      name: "Shopping Card",
      type: "Virtual",
      number: "4532 9876 5432 1098",
      balance: 500.0,
      status: "Active",
      color: "from-green-600 to-teal-600",
    },
    {
      id: 3,
      name: "Travel Card",
      type: "Physical",
      number: "4532 5555 4444 3333",
      balance: 1200.0,
      status: "Frozen",
      color: "from-orange-600 to-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Add New Card Button */}
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Add New Card
      </Button>

      {/* Cards List */}
      <div className="space-y-4">
        {cards.map((card) => (
          <Card key={card.id} className="bg-gray-900/50 border-gray-800 overflow-hidden">
            <CardContent className="p-0">
              {/* Card Visual */}
              <div className={`bg-gradient-to-r ${card.color} p-6 text-white relative`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm opacity-80">{card.type} Card</div>
                    <div className="font-semibold">{card.name}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem className="text-white">View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Set Limits</DropdownMenuItem>
                      <DropdownMenuItem className="text-white">Freeze Card</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">Delete Card</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-lg tracking-wider">
                    {showCardNumbers ? card.number : "•••• •••• •••• " + card.number.slice(-4)}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-80">Balance</div>
                      <div className="text-xl font-bold">${card.balance.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={card.status === "Active" ? "default" : "secondary"}
                        className={card.status === "Active" ? "bg-green-600" : "bg-gray-600"}
                      >
                        {card.status}
                      </Badge>
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 space-y-3">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 bg-transparent">
                    Top Up
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 bg-transparent">
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 bg-transparent">
                    Settings
                  </Button>
                </div>

                {/* Recent Transactions */}
                <div className="space-y-2">
                  <div className="text-white text-sm font-medium">Recent Transactions</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Amazon Purchase</span>
                      <span className="text-red-400">-$45.99</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Coffee Shop</span>
                      <span className="text-red-400">-$4.50</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Top Up</span>
                      <span className="text-green-400">+$100.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toggle Card Numbers */}
      <Button
        variant="outline"
        onClick={() => setShowCardNumbers(!showCardNumbers)}
        className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
      >
        {showCardNumbers ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
        {showCardNumbers ? "Hide" : "Show"} Card Numbers
      </Button>
    </div>
  )
}
