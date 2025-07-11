"use client"

import { useState, useEffect } from "react"
import { AuroraBackground } from "@/components/aurora-background"
import { BottomNav } from "@/components/bottom-nav"
import { WalletDashboard } from "@/components/wallet-dashboard"
import { TransferWorking } from "@/components/transfer-working"
import { CardsManagement } from "@/components/cards-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SwipeIndicator } from "@/components/swipe-indicator"
import { useSwipe } from "@/hooks/use-swipe"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialDashboardSimple } from "@/components/financial-dashboard-simple"

export default function StablecoinWallet() {
  const [activeTab, setActiveTab] = useState("wallet")
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right">("right")

  // Define tab order for swipe navigation
  const tabs = ["wallet", "transfer", "cards", "analytics", "settings"]
  const currentTabIndex = tabs.indexOf(activeTab)

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
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const renderContent = () => {
    return (
      <>
        {(() => {
          switch (activeTab) {
            case "wallet":
              return <WalletDashboard onTransferClick={() => handleTabChange("transfer")} />
            case "transfer":
              return <TransferWorking />
            case "cards":
              return <CardsManagement />
            case "analytics":
              return <AnalyticsDashboard />
            case "settings":
              return (
                <div className="space-y-6">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Financial Management</h2>
                    <p className="text-gray-400">Track your expenses, budgets, and financial goals</p>
                  </div>
                  <FinancialDashboardSimple />
                </div>
              )
            default:
              return <WalletDashboard onTransferClick={() => handleTabChange("transfer")} />
          }
        })()}
      </>
    )
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "wallet":
        return "Wallet"
      case "transfer":
        return "Transfer Funds"
      case "cards":
        return "Cards"
      case "analytics":
        return "Analytics"
      case "settings":
        return "Settings"
      default:
        return "Wallet"
    }
  }

  const getTabProgress = () => {
    return ((currentTabIndex + 1) / tabs.length) * 100
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 flex flex-col min-h-screen" ref={swipeRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg border-b border-gray-800 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-sm">Stablecoin Wallet</p>
              <div className="flex items-center space-x-1">
                {tabs.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentTabIndex ? "bg-purple-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-0.5 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${getTabProgress()}%` }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 pb-24 overflow-y-auto">
          <div className="transition-all duration-300 ease-in-out">{renderContent()}</div>
        </div>

        {/* Swipe Hint */}
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          {showSwipeHint && (
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm animate-fade-in-out">
              👈 Swipe to navigate 👉
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Swipe Indicators */}
      <SwipeIndicator show={showSwipeHint} direction={swipeDirection} />
    </div>
  )
}
