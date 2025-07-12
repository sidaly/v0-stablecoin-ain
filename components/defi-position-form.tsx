"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, TrendingUp, Clock } from "lucide-react"
import { createDefiPosition } from "@/lib/defi-actions"

interface DefiPositionFormProps {
  protocols: any[]
  opportunities: any[]
  onSuccess?: () => void
  onCancel?: () => void
}

export function DefiPositionForm({ protocols, opportunities, onSuccess, onCancel }: DefiPositionFormProps) {
  const [selectedProtocol, setSelectedProtocol] = useState("")
  const [selectedPool, setSelectedPool] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  const selectedPoolData = opportunities.find((opp) => opp.id === selectedPool)
  const filteredPools = opportunities.filter((opp) => opp.protocol_name === selectedProtocol)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPool || !amount) return

    setLoading(true)
    try {
      const result = await createDefiPosition(
        userId,
        selectedPoolData.protocol_id,
        selectedPool,
        selectedPoolData.pool_type,
        Number.parseFloat(amount),
      )

      if (result.success) {
        onSuccess?.()
      } else {
        console.error("Failed to create position:", result.error)
      }
    } catch (error) {
      console.error("Error creating position:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-600"
      case "medium":
        return "bg-yellow-600"
      case "high":
        return "bg-orange-600"
      case "very_high":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const calculateProjectedReturns = () => {
    if (!selectedPoolData || !amount) return null

    const amountNum = Number.parseFloat(amount)
    const apy = Number.parseFloat(selectedPoolData.current_apy)

    const monthlyReturn = (amountNum * apy) / 100 / 12
    const yearlyReturn = (amountNum * apy) / 100

    return {
      monthly: monthlyReturn,
      yearly: yearlyReturn,
    }
  }

  const projectedReturns = calculateProjectedReturns()

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Create New DeFi Position</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Protocol Selection */}
          <div className="space-y-2">
            <Label htmlFor="protocol" className="text-white">
              Select Protocol
            </Label>
            <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose a DeFi protocol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {protocols.map((protocol) => (
                  <SelectItem key={protocol.id} value={protocol.name} className="text-white">
                    <div className="flex items-center space-x-2">
                      <span>{protocol.name}</span>
                      <Badge className={getRiskColor(protocol.risk_level)} size="sm">
                        {protocol.risk_level}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pool Selection */}
          {selectedProtocol && (
            <div className="space-y-2">
              <Label htmlFor="pool" className="text-white">
                Select Pool
              </Label>
              <Select value={selectedPool} onValueChange={setSelectedPool}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Choose a pool" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {filteredPools.map((pool) => (
                    <SelectItem key={pool.id} value={pool.id} className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span>{pool.pool_name}</span>
                        <span className="text-green-400 ml-2">
                          {Number.parseFloat(pool.current_apy).toFixed(2)}% APY
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Pool Details */}
          {selectedPoolData && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">{selectedPoolData.pool_name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(selectedPoolData.risk_level)} size="sm">
                      {selectedPoolData.risk_level} risk
                    </Badge>
                    {selectedPoolData.audit_status === "audited" && (
                      <Badge className="bg-green-600" size="sm">
                        <Shield className="w-3 h-3 mr-1" />
                        Audited
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Current APY</div>
                    <div className="text-green-400 font-semibold">
                      {Number.parseFloat(selectedPoolData.current_apy).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">TVL</div>
                    <div className="text-white">{formatCurrency(Number.parseFloat(selectedPoolData.tvl))}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Min Deposit</div>
                    <div className="text-white">
                      {formatCurrency(Number.parseFloat(selectedPoolData.minimum_deposit))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Lock Period</div>
                    <div className="text-white">
                      {selectedPoolData.lock_period_days > 0 ? `${selectedPoolData.lock_period_days} days` : "None"}
                    </div>
                  </div>
                </div>

                {selectedPoolData.lock_period_days > 0 && (
                  <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Funds will be locked for {selectedPoolData.lock_period_days} days</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">
              Investment Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              min={selectedPoolData ? selectedPoolData.minimum_deposit : 1}
              step="0.01"
            />
            {selectedPoolData &&
              amount &&
              Number.parseFloat(amount) < Number.parseFloat(selectedPoolData.minimum_deposit) && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Minimum deposit is {formatCurrency(Number.parseFloat(selectedPoolData.minimum_deposit))}</span>
                </div>
              )}
          </div>

          {/* Projected Returns */}
          {projectedReturns && (
            <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-800">
              <CardContent className="p-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Projected Returns
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Monthly</div>
                    <div className="text-green-400 font-semibold">{formatCurrency(projectedReturns.monthly)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Yearly</div>
                    <div className="text-green-400 font-semibold">{formatCurrency(projectedReturns.yearly)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  * Projections based on current APY. Actual returns may vary.
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-700 text-gray-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedPool || !amount || loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Creating Position..." : "Invest Now"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
