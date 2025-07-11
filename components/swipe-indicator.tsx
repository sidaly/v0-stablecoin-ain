"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

interface SwipeIndicatorProps {
  show: boolean
  direction: "left" | "right"
}

export function SwipeIndicator({ show, direction }: SwipeIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div
      className={`fixed top-1/2 transform -translate-y-1/2 z-40 pointer-events-none transition-all duration-300 ${
        direction === "left" ? "left-4 animate-pulse" : "right-4 animate-pulse"
      } ${visible ? "opacity-70" : "opacity-0"}`}
    >
      <div className="bg-purple-600/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
        {direction === "left" ? (
          <ChevronLeft className="w-6 h-6 text-white" />
        ) : (
          <ChevronRight className="w-6 h-6 text-white" />
        )}
      </div>
    </div>
  )
}
