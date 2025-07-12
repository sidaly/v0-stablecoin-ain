"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Coins,
  Zap,
  Shield,
  AlertTriangle,
  ExternalLink,
  Plus,
  Minus,
  Gift,
  BarChart3,
  Target,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  getUserDefiPositions,
  getDefiProtocols,
  getTopDefiOpportunities,
  getDefiAlerts,
  getMarketData,
} from "@/lib/defi-actions"

export function DefiDashboard() {
  const [positions, setPositions] = useState<any[]>([])
  const [portfolioMetrics, setPortfolioMetrics] = useState<any>({})
  const [protocols, setProtocols] = useState<any[]>([])
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [marketData, setMarketData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user ID - in a real app, this would come from authentication
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    loadDefiData()
  }, [])

  const loadDefiData = async () => {
    try {
      setLoading(true)
      const [positionsResult, protocolsResult, opportunitiesResult, alertsResult, marketResult] = await Promise.all([
        getUserDefiPositions(userId),
        getDefiProtocols(),
        getTopDefiOpportunities(8),
        getDefiAlerts(userId),
        getMarketData(["USDC", "USDT", "DAI", "AAVE", "COMP", "UNI", "CRV", "YFI"]),
      ])

      if (positionsResult.success) {
        setPositions(positionsResult.positions)
        setPortfolioMetrics(positionsResult.portfolioMetrics)
      }
      if (protocolsResult.success) setProtocols(protocolsResult.protocols)
      if (opportunitiesResult.success) setOpportunities(opportunitiesResult.opportunities)
      if (alertsResult.success) setAlerts(alertsResult.alerts)
      if (marketResult.success) setMarketData(marketResult.marketData)
    } catch (error) {
      console.error("Error loading DeFi data:", error)
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

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
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

  const getPositionTypeIcon = (type: string) => {
    switch (type) {
      case "lending":
        return <Coins className="w-4 h-4" />
      case "liquidity_provision":
        return <BarChart3 className="w-4 h-4" />
      case "yield_farming":
        return <Target className="w-4 h-4" />
      case "staking":
        return <Shield className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Loading DeFi Data...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Total Value</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">
              {formatCurrency(Number.parseFloat(portfolioMetrics.current_value || 0))}
            </div>
            <div className="text-purple-400 text-xs">
              {formatPercentage(Number.parseFloat(portfolioMetrics.total_return_percentage || 0))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Total Rewards</span>
            </div>
            <div className="text-white text-xl font-bold mt-1">
              {formatCurrency(Number.parseFloat(portfolioMetrics.total_rewards || 0))}
            </div>
            <div className="text-green-400 text-xs">Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* DeFi Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              DeFi Alerts ({alerts.filter((a: any) => !a.is_read).length} unread)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.slice(0, 2).map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      alert.severity === "critical"
                        ? "text-red-400"
                        : alert.severity === "warning"
                          ? "text-yellow-400"
                          : "text-blue-400"
                    }`}
                  />
                  <div>
                    <div className="text-white text-sm font-medium">{alert.title}</div>
                    <div className="text-gray-400 text-xs">{alert.message}</div>
                  </div>
                </div>
                {!alert.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="positions" className="text-white data-[state=active]:bg-purple-600">
            Positions
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="text-white data-[state=active]:bg-purple-600">
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="protocols" className="text-white data-[state=active]:bg-purple-600">
            Protocols
          </TabsTrigger>
          <TabsTrigger value="market" className="text-white data-[state=active]:bg-purple-600">
            Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Your DeFi Positions</h3>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Position
            </Button>
          </div>

          {positions.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">No DeFi positions yet</div>
                <Button className="bg-purple-600 hover:bg-purple-700">Start Your DeFi Journey</Button>
              </CardContent>
            </Card>
          ) : (
            positions.map((position: any) => {
              const pnl = Number.parseFloat(position.current_value) - Number.parseFloat(position.amount_deposited)
              const pnlPercentage = (pnl / Number.parseFloat(position.amount_deposited)) * 100

              return (
                <Card key={position.id} className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPositionTypeIcon(position.position_type)}
                        <div>
                          <CardTitle className="text-white text-lg">{position.protocol_name}</CardTitle>
                          <div className="text-gray-400 text-sm">
                            {position.pool_name || position.position_type.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${pnl >= 0 ? "bg-green-600" : "bg-red-600"}`}>
                        {formatPercentage(pnlPercentage)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">Deposited</div>
                        <div className="text-white font-semibold">
                          {formatCurrency(Number.parseFloat(position.amount_deposited))}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Current Value</div>
                        <div className="text-white font-semibold">
                          {formatCurrency(Number.parseFloat(position.current_value))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">APY</div>
                        <div className="text-green-400 font-semibold">
                          {Number.parseFloat(position.current_apy).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Rewards Earned</div>
                        <div className="text-purple-400 font-semibold">
                          {formatCurrency(Number.parseFloat(position.rewards_earned))}
                        </div>
                      </div>
                    </div>

                    {position.lock_end_date && (
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Locked until {new Date(position.lock_end_date).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Withdraw
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Rewards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <h3 className="text-white font-semibold">Top DeFi Opportunities</h3>

          <div className="space-y-3">
            {opportunities.map((opportunity: any) => (
              <Card key={opportunity.id} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {opportunity.protocol_name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{opportunity.protocol_name}</div>
                        <div className="text-gray-400 text-sm">
                          {opportunity.pool_name} • {opportunity.token_pair || opportunity.base_token}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRiskColor(opportunity.risk_level)} size="sm">
                            {opportunity.risk_level}
                          </Badge>
                          {opportunity.audit_status === "audited" && (
                            <Badge className="bg-green-600" size="sm">
                              <Shield className="w-3 h-3 mr-1" />
                              Audited
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-xl font-bold">
                        {Number.parseFloat(opportunity.current_apy).toFixed(2)}%
                      </div>
                      <div className="text-gray-400 text-xs">APY</div>
                      <div className="text-gray-400 text-xs">
                        TVL: {formatCurrency(Number.parseFloat(opportunity.tvl))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-400">
                      Min: {formatCurrency(Number.parseFloat(opportunity.minimum_deposit))}
                      {opportunity.lock_period_days > 0 && ` • ${opportunity.lock_period_days} days lock`}
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Invest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <h3 className="text-white font-semibold">DeFi Protocols</h3>

          <div className="grid grid-cols-1 gap-3">
            {protocols.map((protocol: any) => (
              <Card key={protocol.id} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{protocol.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-lg">{protocol.name}</div>
                        <div className="text-gray-400 text-sm">{protocol.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className="bg-blue-600" size="sm">
                            {protocol.protocol_type.replace("_", " ")}
                          </Badge>
                          <Badge className={getRiskColor(protocol.risk_level)} size="sm">
                            {protocol.risk_level} risk
                          </Badge>
                          {protocol.audit_status === "audited" && (
                            <Badge className="bg-green-600" size="sm">
                              <Shield className="w-3 h-3 mr-1" />
                              Audited
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatCurrency(Number.parseFloat(protocol.tvl))}</div>
                      <div className="text-gray-400 text-xs">TVL</div>
                      <div className="text-green-400 text-sm">
                        {Number.parseFloat(protocol.apy_range_min).toFixed(1)}% -{" "}
                        {Number.parseFloat(protocol.apy_range_max).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-400">
                      Chain: {protocol.chain} • {protocol.audit_status}
                    </div>
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Pools
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <h3 className="text-white font-semibold">Market Data</h3>

          <div className="space-y-3">
            {marketData.map((token: any) => (
              <Card key={token.token_symbol} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.token_symbol.slice(0, 3)}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{token.token_symbol}</div>
                        <div className="text-gray-400 text-sm">
                          Vol: {formatCurrency(Number.parseFloat(token.volume_24h))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {formatCurrency(Number.parseFloat(token.price_usd))}
                      </div>
                      <div
                        className={`text-sm ${
                          Number.parseFloat(token.price_change_24h) >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatPercentage(Number.parseFloat(token.price_change_24h))}
                      </div>
                      <div className="text-gray-400 text-xs">
                        MCap: {formatCurrency(Number.parseFloat(token.market_cap))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
