"use client"

import { useState } from "react"
import { AuroraBackground } from "@/components/aurora-background"
import { BottomNav } from "@/components/bottom-nav"
import { WalletDashboard } from "@/components/wallet-dashboard"
import { TransferFunds } from "@/components/transfer-funds"
import { CurrencyConverter } from "@/components/currency-converter"
import { CardsManagement } from "@/components/cards-management"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StablecoinWallet() {
  const [activeTab, setActiveTab] = useState("wallet")

  const renderContent = () => {
    switch (activeTab) {
      case "wallet":
        return <WalletDashboard />
      case "transfer":
        return <TransferFunds />
      case "cards":
        return <CardsManagement />
      case "analytics":
        return <AnalyticsDashboard />
      case "settings":
        return (
          <div className="space-y-6">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Settings</h2>
              <p className="text-gray-400">Manage your account and preferences</p>
            </div>
            <CurrencyConverter />
          </div>
        )
      default:
        return <WalletDashboard />
    }
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case "wallet":
        return "Wallet"
      case "transfer":
        return "Transfer"
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

  return (
    <div className="min-h-screen bg-black text-white relative">
      <AuroraBackground />

      <div className="relative z-10 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-lg border-b border-gray-800">
          <div>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
            <p className="text-gray-400 text-sm">Stablecoin Wallet</p>
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

        {/* Main Content */}
        <div className="p-4">{renderContent()}</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
