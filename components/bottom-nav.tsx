"use client"

import { Home, Wallet, ArrowUpDown, CreditCard, BarChart3, TrendingUp, Settings, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "transfer", icon: ArrowUpDown, label: "Transfer" },
    { id: "defi", icon: TrendingUp, label: "DeFi" },
    { id: "cards", icon: CreditCard, label: "Cards" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div className="bg-black/80 backdrop-blur-xl border-t border-gray-700/50">
        <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-[50px] relative",
                  isActive
                    ? "text-purple-400 bg-purple-500/20 scale-110 shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                )}

                <Icon className={cn("w-4 h-4 mb-1", isActive && "animate-pulse")} />
                <span className={cn("text-xs font-medium", isActive && "text-purple-300")}>{tab.label}</span>

                {/* Glow effect for active tab */}
                {isActive && <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-sm -z-10" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
