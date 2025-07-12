"use client"

import { useState, useEffect } from "react"
import { AuroraBackground } from "@/components/aurora-background"
import { BottomNav } from "@/components/bottom-nav"
import { FuturisticHome } from "@/components/futuristic-home"
import { WalletDashboard } from "@/components/wallet-dashboard"
import { TransferWorking } from "@/components/transfer-working"
import { CardsManagement } from "@/components/cards-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SwipeIndicator } from "@/components/swipe-indicator"
import { useSwipe } from "@/hooks/use-swipe"
import { Bell, User, Wifi, Battery } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialDashboard } from "@/components/financial-dashboard"
import { DefiDashboard } from "@/components/defi-dashboard"
import { LifestyleDashboard } from "@/components/lifestyle-dashboard"

export default function StablecoinWallet() {
  const [activeTab, setActiveTab] = useState("home")
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right">("right")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Define tab order for swipe navigation
  const tabs = ["home", "wallet", "transfer", "defi", "cards", "rewards", "analytics", "settings"]
  const currentTabIndex = tabs.indexOf(activeTab)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const navigateToTab = (direction: "next" | "prev") => {
    const currentIndex = tabs.indexOf(activeTab)
    let newIndex: number

    if (direction === "next") {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0 // Loop to first
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1 // Loop to last
    }

    setActiveTab(tabs[newIndex])

    // Show swipe indicator
    setSwipeDirection(direction === "next" ? "right" : "left")
    setShowSwipeHint(true)
  }

  // Swipe handlers
  const swipeHandlers = {
    onSwipeLeft: () => navigateToTab("next"),
    onSwipeRight: () => navigateToTab("prev"),
  }

  const swipeRef = useSwipe(swipeHandlers, {
    threshold: 75, // Require a longer swipe to prevent accidental navigation
    preventDefaultTouchmoveEvent: false,
  })

  // Show initial swipe hint after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setSwipeDirection("right")
      setShowSwipeHint(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const renderContent = () => {
    return (
      <>
        {(() => {
          switch (activeTab) {
            case "home":
              return <FuturisticHome onNavigate={handleTabChange} />
            case "wallet":
              return <WalletDashboard onTransferClick={() => handleTabChange("transfer")} />
            case "transfer":
              return <TransferWorking />
            case "defi":
              return (
                <div className="space-y-6">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      DeFi Hub
                    </h2>
                    <p className="text-gray-400">Maximize your yields with decentralized finance</p>
                  </div>
                  <DefiDashboard />
                </div>
              )
            case "rewards":
              return (
                <div className="space-y-6">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Rewards Hub
                    </h2>
                    <p className="text-gray-400">Earn rewards and unlock exclusive lifestyle benefits</p>
                  </div>
                  <LifestyleDashboard />
                </div>
              )
            case "cards":
              return <CardsManagement />
            case "analytics":
              return <AnalyticsDashboard />
            case "settings":
              return (
                <div className="space-y-6">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Financial Management
                    </h2>
                    <p className="text-gray-400">Track your expenses, budgets, and financial goals</p>
                  </div>
                  <FinancialDashboard />
                </div>
              )
            default:
              return <FuturisticHome onNavigate={handleTabChange} />
          }
        })()}
      </>
    )
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "home":
        return "Home"
      case "wallet":
        return "Wallet"
      case "transfer":
        return "Transfer"
      case "defi":
        return "DeFi"
      case "cards":
        return "Cards"
      case "rewards":
        return "Rewards"
      case "analytics":
        return "Analytics"
      case "settings":
        return "Settings"
      default:
        return "Home"
    }
  }

  const getTabProgress = () => {
    return ((currentTabIndex + 1) / tabs.length) * 100
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 flex flex-col min-h-screen" ref={swipeRef}>
        {/* Futuristic Header */}
        <div className="flex items-center justify-between p-4 bg-black/60 backdrop-blur-xl border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg font-bold text-white">{getPageTitle()}</h1>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Wifi className="w-3 h-3" />
                  <span>5G</span>
                </span>
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Battery className="w-3 h-3" />
              <span>85%</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1 bg-gray-800/50">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${getTabProgress()}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Main Content with Enhanced Animations */}
        <div className="flex-1 p-4 pb-28 overflow-y-auto">
          <div className="transition-all duration-500 ease-in-out transform">{renderContent()}</div>
        </div>

        {/* Futuristic Swipe Hint */}
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          {showSwipeHint && (
            <div className="bg-black/90 backdrop-blur-xl rounded-full px-6 py-3 text-white text-sm border border-gray-700/50 shadow-2xl animate-fade-in-out">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>👈 Swipe to navigate 👉</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Enhanced Swipe Indicators */}
      <SwipeIndicator show={showSwipeHint} direction={swipeDirection} />

      {/* Additional Futuristic Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-cyan-500/50 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 animate-pulse" />
    </div>
  )
}
