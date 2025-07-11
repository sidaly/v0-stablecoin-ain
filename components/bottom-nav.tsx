"use client"

import { Wallet, ArrowUpDown, CreditCard, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "transfer", icon: ArrowUpDown, label: "Transfer" },
    { id: "cards", icon: CreditCard, label: "Cards" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-gray-800 safe-area-pb">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-purple-400 bg-purple-500/20 scale-105"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50",
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "animate-pulse")} />
              <span className={cn("text-xs font-medium", isActive && "text-purple-300")}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
