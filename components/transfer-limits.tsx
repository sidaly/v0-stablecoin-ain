"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Settings } from "lucide-react"
import { useState } from "react"

interface TransferLimits {
  dailyLimit: number
  monthlyLimit: number
  dailyUsed: number
  monthlyUsed: number
  limitsEnabled: boolean
  lastResetDate: string
}

interface TransferLimitsProps {
  limits: TransferLimits
  onUpdateLimits: (limits: TransferLimits) => void
}

export function TransferLimitsComponent({ limits, onUpdateLimits }: TransferLimitsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempLimits, setTempLimits] = useState(limits)

  const dailyPercentage = limits.limitsEnabled ? (limits.dailyUsed / limits.dailyLimit) * 100 : 0
  const monthlyPercentage = limits.limitsEnabled ? (limits.monthlyUsed / limits.monthlyLimit) * 100 : 0

  const dailyRemaining = Math.max(0, limits.dailyLimit - limits.dailyUsed)
  const monthlyRemaining = Math.max(0, limits.monthlyLimit - limits.monthlyUsed)

  const handleSave = () => {
    onUpdateLimits(tempLimits)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempLimits(limits)
    setIsEditing(false)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStatusBadge = (used: number, limit: number, enabled: boolean) => {
    if (!enabled)
      return (
        <Badge variant="secondary" className="bg-gray-600">
          Disabled
        </Badge>
      )

    const percentage = (used / limit) * 100
    if (percentage >= 100) return <Badge className="bg-red-600">Limit Reached</Badge>
    if (percentage >= 90) return <Badge className="bg-yellow-600">Near Limit</Badge>
    if (percentage >= 75) return <Badge className="bg-orange-600">High Usage</Badge>
    return <Badge className="bg-green-600">Active</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Limits Overview */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Transfer Limits
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Limits */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-300 font-medium">Transfer Limits</Label>
              <p className="text-gray-400 text-sm">Enable daily and monthly spending limits for security</p>
            </div>
            <Switch
              checked={isEditing ? tempLimits.limitsEnabled : limits.limitsEnabled}
              onCheckedChange={(checked) =>
                isEditing
                  ? setTempLimits({ ...tempLimits, limitsEnabled: checked })
                  : onUpdateLimits({ ...limits, limitsEnabled: checked })
              }
            />
          </div>

          {(isEditing ? tempLimits.limitsEnabled : limits.limitsEnabled) && (
            <>
              {/* Daily Limit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 font-medium">Daily Limit</Label>
                  {getStatusBadge(limits.dailyUsed, limits.dailyLimit, limits.limitsEnabled)}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={tempLimits.dailyLimit}
                      onChange={(e) =>
                        setTempLimits({ ...tempLimits, dailyLimit: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Daily limit amount"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Used: ${limits.dailyUsed.toLocaleString()}</span>
                      <span className="text-gray-400">Limit: ${limits.dailyLimit.toLocaleString()}</span>
                    </div>
                    <Progress value={dailyPercentage} className="h-2 bg-gray-800" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Remaining: ${dailyRemaining.toLocaleString()}</span>
                      <span className="text-gray-400">{dailyPercentage.toFixed(1)}% used</span>
                    </div>
                  </>
                )}
              </div>

              {/* Monthly Limit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300 font-medium">Monthly Limit</Label>
                  {getStatusBadge(limits.monthlyUsed, limits.monthlyLimit, limits.limitsEnabled)}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={tempLimits.monthlyLimit}
                      onChange={(e) =>
                        setTempLimits({ ...tempLimits, monthlyLimit: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Monthly limit amount"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Used: ${limits.monthlyUsed.toLocaleString()}</span>
                      <span className="text-gray-400">Limit: ${limits.monthlyLimit.toLocaleString()}</span>
                    </div>
                    <Progress value={monthlyPercentage} className="h-2 bg-gray-800" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">Remaining: ${monthlyRemaining.toLocaleString()}</span>
                      <span className="text-gray-400">{monthlyPercentage.toFixed(1)}% used</span>
                    </div>
                  </>
                )}
              </div>

              {/* Warning Messages */}
              {!isEditing && limits.limitsEnabled && (
                <>
                  {dailyPercentage >= 90 && (
                    <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">Daily limit almost reached!</span>
                    </div>
                  )}
                  {monthlyPercentage >= 90 && (
                    <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">Monthly limit almost reached!</span>
                    </div>
                  )}
                </>
              )}

              {/* Save/Cancel Buttons */}
              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Limit Presets */}
      {isEditing && tempLimits.limitsEnabled && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-sm">Quick Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setTempLimits({ ...tempLimits, dailyLimit: 500, monthlyLimit: 10000 })}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Conservative
                <div className="text-xs text-gray-400 ml-2">$500/$10K</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setTempLimits({ ...tempLimits, dailyLimit: 1000, monthlyLimit: 25000 })}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Moderate
                <div className="text-xs text-gray-400 ml-2">$1K/$25K</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setTempLimits({ ...tempLimits, dailyLimit: 2500, monthlyLimit: 50000 })}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                High
                <div className="text-xs text-gray-400 ml-2">$2.5K/$50K</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setTempLimits({ ...tempLimits, dailyLimit: 10000, monthlyLimit: 100000 })}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Business
                <div className="text-xs text-gray-400 ml-2">$10K/$100K</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
