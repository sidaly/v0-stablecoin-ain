"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Zap,
  Shield,
  Coins,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  Send,
  ArrowDownLeft,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Cpu,
} from "lucide-react"
import { useState, useEffect } from "react"

interface FuturisticHomeProps {
  onNavigate: (tab: string) => void
}

export function FuturisticHome({ onNavigate }: FuturisticHomeProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const animationTimer = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 4)
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(animationTimer)
    }
  }, [])

  const portfolioData = {
    totalBalance: 4500.75,
    dailyChange: 127.5,
    dailyChangePercent: 2.8,
    defiValue: 8768.5,
    defiApy: 15.2,
    activePositions: 3,
    totalRewards: 342.75,
  }

  const quickStats = [
    {
      label: "DeFi Value",
      value: `$${portfolioData.defiValue.toLocaleString()}`,
      change: "+12.5%",
      icon: TrendingUp,
      color: "from-purple-500 to-blue-500",
      bgColor: "from-purple-900/20 to-blue-900/20",
    },
    {
      label: "Avg APY",
      value: `${portfolioData.defiApy}%`,
      change: "+2.1%",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-900/20 to-emerald-900/20",
    },
    {
      label: "Rewards",
      value: `$${portfolioData.totalRewards}`,
      change: "+$45.20",
      icon: Sparkles,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-900/20 to-orange-900/20",
    },
    {
      label: "Positions",
      value: portfolioData.activePositions.toString(),
      change: "+1",
      icon: Target,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-900/20 to-rose-900/20",
    },
  ]

  const quickActions = [
    {
      label: "Send",
      icon: Send,
      action: () => onNavigate("transfer"),
      color: "bg-gradient-to-r from-blue-600 to-cyan-600",
      hoverColor: "hover:from-blue-700 hover:to-cyan-700",
    },
    {
      label: "Receive",
      icon: ArrowDownLeft,
      action: () => onNavigate("transfer"),
      color: "bg-gradient-to-r from-green-600 to-emerald-600",
      hoverColor: "hover:from-green-700 hover:to-emerald-700",
    },
    {
      label: "DeFi",
      icon: TrendingUp,
      action: () => onNavigate("defi"),
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
      hoverColor: "hover:from-purple-700 hover:to-pink-700",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      action: () => onNavigate("analytics"),
      color: "bg-gradient-to-r from-orange-600 to-red-600",
      hoverColor: "hover:from-orange-700 hover:to-red-700",
    },
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Futuristic Header */}
      <div className="relative overflow-hidden">
        <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>Global Network</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Cpu className="w-4 h-4" />
                    <span>{formatTime(currentTime)}</span>
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>

            {/* Main Balance Display */}
            <div className="relative">
              <div className="text-4xl font-bold text-white mb-2">
                {showBalance ? `$${portfolioData.totalBalance.toLocaleString()}` : "••••••••"}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-green-400 font-semibold">
                  +${portfolioData.dailyChange} ({portfolioData.dailyChangePercent}%)
                </div>
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Today</Badge>
              </div>

              {/* Animated Background Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 opacity-10">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse transition-transform duration-2000 ${
                    animationPhase % 2 === 0 ? "scale-100" : "scale-110"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bgColor} border-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-600`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-white font-bold text-lg">{showBalance ? stat.value : "••••"}</div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                  <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  onClick={action.action}
                  className={`${action.color} ${action.hoverColor} text-white flex flex-col py-6 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* DeFi Spotlight */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                DeFi Spotlight
              </h3>
              <p className="text-gray-400 text-sm">Maximize your yields</p>
            </div>
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 animate-pulse">Hot</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Curve 3Pool</div>
                  <div className="text-gray-400 text-xs">USDC/USDT/DAI</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">18.5%</div>
                <div className="text-gray-400 text-xs">APY</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Aave USDC</div>
                  <div className="text-gray-400 text-xs">Lending Pool</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">4.25%</div>
                <div className="text-gray-400 text-xs">APY</div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onNavigate("defi")}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Explore DeFi Opportunities
          </Button>
        </CardContent>
      </Card>

      {/* Market Pulse */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
            Market Pulse
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { symbol: "USDC", price: "$1.0001", change: "+0.01%" },
              { symbol: "USDT", price: "$0.9998", change: "-0.02%" },
              { symbol: "DAI", price: "$1.0003", change: "+0.03%" },
            ].map((token, index) => (
              <div
                key={token.symbol}
                className="text-center p-3 bg-gray-800/50 rounded-lg transition-all duration-300 hover:bg-gray-800/70"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="text-white font-medium">{token.symbol}</div>
                <div className="text-gray-400 text-sm">{token.price}</div>
                <div
                  className={`text-xs font-medium ${token.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                >
                  {token.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
